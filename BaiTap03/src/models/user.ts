import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Khai báo các thuộc tính của User
interface UserAttributes {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string | null;
  phoneNumber?: string | null;
  gender: boolean;
  image?: string | null;
  roleId?: string | null;
  positionId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Cho phép id và các field tự sinh có thể undefined khi tạo mới
interface UserCreationAttributes extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public address!: string | null;
  public phoneNumber!: string | null;
  public gender!: boolean;
  public image!: string | null;
  public roleId!: string | null;
  public positionId!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Định nghĩa mối quan hệ
  static associate(models: any) {
    // ví dụ: User.hasMany(models.Post);
  }
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
      image: DataTypes.STRING,
      roleId: DataTypes.STRING,
      positionId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users", // nếu bảng tên Users
      timestamps: true,
    }
  );

  return User;
};
