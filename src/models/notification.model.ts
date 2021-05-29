import { Column, DataType, NotNull, Table, Model, AllowNull, IsUUID, Default } from "sequelize-typescript";
import { UUID } from "sequelize/types";

@Table({tableName:'notification'})
export default class Notification extends Model {

    @Column
    subject : string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    content : string

    @AllowNull(false)
    @Column
    recipient : string;

    @Column(DataType.TEXT)
    cc : string;

    @Default(false)
    @Column
    isEmail : boolean;

    @Column
    username : string

    @Default(false)
    @Column
    notificationSent : boolean;

}