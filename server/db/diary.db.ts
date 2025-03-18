import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { conn } from './conn';

export class DiaryModel extends Model<InferAttributes<DiaryModel>, InferCreationAttributes<DiaryModel>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare owner: string;
}

// Data structure for diaries. Entries are stored in a separate table.
DiaryModel.init(
    {
        id: { // diary id, id is unique and global.
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        title: { // diary title
            type: DataTypes.STRING,
            allowNull: false
        },
        owner: { // creator of the diary
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: conn,
        tableName: "diaries",
        timestamps: false,
    }
);