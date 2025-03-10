import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { conn } from './conn';
import { DiaryModel } from './diary.db';

export class EntryModel extends Model<InferAttributes<EntryModel>, InferCreationAttributes<EntryModel>> {
    // The id of the diary in which entry belongs
    declare diaryId: number;

    // Entry id, should they be unique by themselves or in combination with diary id?
    declare id: CreationOptional<number>;

    // The entry text
    declare text: string;

    declare time: number;

}

// A first version of entries to be stored in db
// Currently no entries, should be stored in separate table?
EntryModel.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },

        diaryId: {
            type: DataTypes.BIGINT,
            autoIncrement: false,
            references: {
                model: DiaryModel,
                key: 'id',
            },
            allowNull: false
        },

        text: {
            type: DataTypes.STRING,
            autoIncrement: false,
            allowNull: false
        },

        time: {
            type: DataTypes.BIGINT,
            allowNull: false
        }

        // TODO: Discuss how entries should be stored in correlation to their respective diaries

    },
    {
        sequelize: conn,
        tableName: "entries",
        timestamps: false,
    }
);