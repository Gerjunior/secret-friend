import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateGroupMember1591365506915
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'group_user',
        columns: [
          {
            name: 'group_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'secret_friend_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'member_since',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'GroupToGroupUser',
            referencedTableName: 'group',
            referencedColumnNames: ['id'],
            columnNames: ['group_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'UserToGroupUser',
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'SecretUserToGroupUser',
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['secret_friend_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('group_user', 'GroupToGroupUser');
    await queryRunner.dropForeignKey('group_user', 'UserToGroupUser');

    await queryRunner.dropTable('group_user');
  }
}
