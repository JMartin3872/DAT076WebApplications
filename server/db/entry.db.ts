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

    //Flag signifying if entry is pinned or not
    declare pinned: boolean

    // Timestamp for when entry was created
    declare time: number;

}

// Define the Entry model structure.
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

        pinned:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        time: {
            type: DataTypes.BIGINT,
            allowNull: false
            
        }
    },
    {
        sequelize: conn,
        tableName: "entries",
        timestamps: false,
    }
);