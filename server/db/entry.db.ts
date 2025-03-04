import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { conn } from './conn';

export class EntryModel extends Model<InferAttributes<EntryModel>, InferCreationAttributes<EntryModel>> {
    // The id of the diary in which entry belongs
    declare inDiary: number;

    // Entry id, should they be unique by themselves or in combination with diary id?
    declare id: CreationOptional<number>;

    // Owner of the diary in which entry belongs, unneccesary if all diary ids are unique even between owners?
    declare owner: string;

    // The entry text
    declare text: string;

}

// A first version of entries to be stored in db
// Currently no entries, should be stored in separate table?
EntryModel.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true, // Should or shouldn't be?
            primaryKey: true
        },
        inDiary: {
            type: DataTypes.BIGINT,
            autoIncrement: false,
            primaryKey: true // Should or shouldn't be part of primary key?
        },
        owner: {
            type: DataTypes.STRING,
            allowNull: false
        },
        text: {
            type: DataTypes.STRING,
            autoIncrement: false,
        }

        // TODO: Discuss how entries should be stored in correlation to their respective diaries

    },
    {
        sequelize: conn,
        tableName: "entries",
        timestamps: false,
    }
);