import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";
import Nat64 "mo:core/Nat64";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Random "mo:core/Random";

actor {

  // ===== TYPES =====
  public type Admin = {
    id : Nat;
    email : Text;
    passwordHash : Text;
    salt : Text;
    role : Text;
    createdAt : Int;
    var loginAttempts : Nat;
    var lastAttemptTime : Int;
    var isLocked : Bool;
  };

  public type Session = {
    token : Text;
    adminId : Nat;
    expiresAt : Int;
    createdAt : Int;
  };

  public type AdminInfo = {
    id : Nat;
    email : Text;
    role : Text;
    createdAt : Int;
  };

  public type LoginResult = {
    token : Text;
    admin : AdminInfo;
  };

  // ===== STATE =====
  var nextId : Nat = 0;
  let admins = Map.empty<Text, Admin>();
  let sessions = Map.empty<Text, Session>();

  let SESSION_TTL_NS : Int = 86_400_000_000_000;
  let RATE_LIMIT_WINDOW_NS : Int = 900_000_000_000;
  let MAX_ATTEMPTS : Nat = 5;

  // ===== HASH HELPERS =====
  func fnv1a64(bytes : [Nat8]) : Nat64 {
    var hash : Nat64 = 14695981039346656037;
    for (b in bytes.vals()) {
      hash ^= Nat64.fromNat(b.toNat());
      hash *%= 1099511628211;
    };
    hash;
  };

  func nat64ToHex(n : Nat64) : Text {
    let hexChars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    var result = "";
    var v = n;
    var i = 0;
    while (i < 16) {
      let nibble = (v & 0xf).toNat();
      result := hexChars[nibble] # result;
      v >>= 4;
      i += 1;
    };
    result;
  };

  func hashPassword(password : Text, salt : Text) : Text {
    let bytes = (password # "::" # salt).encodeUtf8().toArray();
    let h1 = fnv1a64(bytes);
    let bytes2 = (nat64ToHex(h1) # password # salt).encodeUtf8().toArray();
    let h2 = fnv1a64(bytes2);
    let bytes3 = (nat64ToHex(h2) # salt # password).encodeUtf8().toArray();
    let h3 = fnv1a64(bytes3);
    let bytes4 = (nat64ToHex(h1) # nat64ToHex(h3)).encodeUtf8().toArray();
    let h4 = fnv1a64(bytes4);
    nat64ToHex(h1) # nat64ToHex(h2) # nat64ToHex(h3) # nat64ToHex(h4);
  };

  func bytesToBase62(bytes : [Nat8]) : Text {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charArr = chars.toArray();
    var result = "";
    for (b in bytes.vals()) {
      let idx = b.toNat() % 62;
      result #= Text.fromChar(charArr[idx]);
    };
    result;
  };

  // ===== INITIALIZATION =====
  system func postupgrade() {};

  let defaultSalt = "smmpanel_salt_2026";
  let defaultHash = hashPassword("Admin@123", defaultSalt);
  let defaultAdmin : Admin = {
    id = 0;
    email = "admin@smmpanel.com";
    passwordHash = defaultHash;
    salt = defaultSalt;
    role = "superadmin";
    createdAt = 0;
    var loginAttempts = 0;
    var lastAttemptTime = 0;
    var isLocked = false;
  };
  admins.add("admin@smmpanel.com", defaultAdmin);
  nextId := 1;

  // ===== PUBLIC API =====

  public func adminLogin(email : Text, password : Text, _ipAddress : Text) : async { #ok : LoginResult; #err : Text } {
    let now = Time.now();
    switch (admins.get(email)) {
      case null { #err("Invalid email or password") };
      case (?admin) {
        if (admin.isLocked) {
          let timeSinceLock = now - admin.lastAttemptTime;
          if (timeSinceLock < RATE_LIMIT_WINDOW_NS) {
            return #err("Account locked. Try again in 15 minutes.");
          } else {
            admin.isLocked := false;
            admin.loginAttempts := 0;
          };
        };

        let computedHash = hashPassword(password, admin.salt);
        if (computedHash != admin.passwordHash) {
          admin.loginAttempts += 1;
          admin.lastAttemptTime := now;
          if (admin.loginAttempts >= MAX_ATTEMPTS) {
            admin.isLocked := true;
            return #err("Too many failed attempts. Account locked for 15 minutes.");
          };
          return #err("Invalid email or password");
        };

        admin.loginAttempts := 0;
        admin.isLocked := false;

        let entropy = await Random.blob();
        let tokenBytes = entropy.toArray();
        let token = bytesToBase62(tokenBytes);

        let session : Session = {
          token = token;
          adminId = admin.id;
          expiresAt = now + SESSION_TTL_NS;
          createdAt = now;
        };
        sessions.add(token, session);

        #ok({
          token = token;
          admin = {
            id = admin.id;
            email = admin.email;
            role = admin.role;
            createdAt = admin.createdAt;
          };
        });
      };
    };
  };

  public query func getAdminMe(sessionToken : Text) : async { #ok : AdminInfo; #err : Text } {
    let now = Time.now();
    switch (sessions.get(sessionToken)) {
      case null { #err("Invalid or expired session") };
      case (?session) {
        if (session.expiresAt < now) {
          return #err("Session expired. Please log in again.");
        };
        for ((_, admin) in admins.entries()) {
          if (admin.id == session.adminId) {
            return #ok({
              id = admin.id;
              email = admin.email;
              role = admin.role;
              createdAt = admin.createdAt;
            });
          };
        };
        #err("Admin not found");
      };
    };
  };

  public func adminLogout(sessionToken : Text) : async { #ok : Text; #err : Text } {
    switch (sessions.get(sessionToken)) {
      case null { #err("Session not found") };
      case (?_) {
        sessions.remove(sessionToken);
        #ok("Logged out successfully");
      };
    };
  };

  public query func checkSession(sessionToken : Text) : async { #ok : AdminInfo; #err : Text } {
    let now = Time.now();
    switch (sessions.get(sessionToken)) {
      case null { #err("Invalid session") };
      case (?session) {
        if (session.expiresAt < now) {
          return #err("Session expired");
        };
        for ((_, admin) in admins.entries()) {
          if (admin.id == session.adminId) {
            return #ok({
              id = admin.id;
              email = admin.email;
              role = admin.role;
              createdAt = admin.createdAt;
            });
          };
        };
        #err("Admin not found");
      };
    };
  };

  public shared func addAdmin(email : Text, password : Text, role : Text) : async { #ok : AdminInfo; #err : Text } {
    switch (admins.get(email)) {
      case (?_) { #err("Admin with this email already exists") };
      case null {
        let entropy = await Random.blob();
        let saltBytes = entropy.toArray();
        let salt = bytesToBase62(saltBytes);
        let passwordHash = hashPassword(password, salt);
        let now = Time.now();
        let admin : Admin = {
          id = nextId;
          email = email;
          passwordHash = passwordHash;
          salt = salt;
          role = role;
          createdAt = now;
          var loginAttempts = 0;
          var lastAttemptTime = 0;
          var isLocked = false;
        };
        admins.add(email, admin);
        nextId += 1;
        #ok({ id = admin.id; email = email; role = role; createdAt = now });
      };
    };
  };

};
