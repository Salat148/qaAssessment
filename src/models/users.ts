export class User {
  constructor(
    public id: string,
    public uuid: string,
    public firstName: string,
    public lastName: string,
    public username: string,
    public password: string,
    public email: string,
    public phoneNumber: string,
    public avatar: string,
    public defaultPrivacyLevel: string,
    public balance: number,
    public createdAt: string,
    public modifiedAt: string
  ) {}

  static Builder = class {
    private id: string;
    private uuid: string = "-1";
    private firstName: string = "";
    private lastName: string = "";
    private username: string = "";
    private password: string = "";
    private email: string = "";
    private phoneNumber: string = "";
    private avatar: string = "";
    private defaultPrivacyLevel: string = "";
    private balance: number = 0;
    private createdAt: string = "";
    private modifiedAt: string = "";

    constructor(id: string) {
      this.id = id;
    }

    withUuid(uuid: string): this {
      this.uuid = uuid;
      return this;
    }

    withFirstName(firstName: string): this {
      this.firstName = firstName;
      return this;
    }

    withLastName(lastName: string): this {
      this.lastName = lastName;
      return this;
    }

    withUsername(username: string): this {
      this.username = username;
      return this;
    }

    withPassword(password: string): this {
      this.password = password;
      return this;
    }

    withEmail(email: string): this {
      this.email = email;
      return this;
    }

    withPhoneNumber(phoneNumber: string): this {
      this.phoneNumber = phoneNumber;
      return this;
    }

    withAvatar(avatar: string): this {
      this.avatar = avatar;
      return this;
    }

    withDefaultPrivacyLevel(defaultPrivacyLevel: string): this {
      this.defaultPrivacyLevel = defaultPrivacyLevel;
      return this;
    }

    withBalance(balance: number): this {
      this.balance = balance;
      return this;
    }

    withCreatedAt(createdAt: string): this {
      this.createdAt = createdAt;
      return this;
    }

    withModifiedAt(modifiedAt: string): this {
      this.modifiedAt = modifiedAt;
      return this;
    }

    build(): User {
      return new User(
        this.id,
        this.uuid,
        this.firstName,
        this.lastName,
        this.username,
        this.password,
        this.email,
        this.phoneNumber,
        this.avatar,
        this.defaultPrivacyLevel,
        this.balance,
        this.createdAt,
        this.modifiedAt
      );
    }
  };

  static fromJSON(json: any): User {
    return new User(
      json.id || "",
      json.uuid || "",
      json.firstName || "",
      json.lastName || "",
      json.username || "",
      json.password || "",
      json.email || "",
      json.phoneNumber || "",
      json.avatar || "",
      json.defaultPrivacyLevel || "",
      json.balance || 0,
      json.createdAt || "",
      json.modifiedAt || ""
    );
  }
}
