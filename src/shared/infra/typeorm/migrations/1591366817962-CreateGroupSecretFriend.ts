import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateGroupSecretFriend1591366817962
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'secret_friend',
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
            isPrimary: true,
          },
          {
            name: 'draw_date',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'GroupToSecretFriend',
            referencedTableName: 'group',
            referencedColumnNames: ['id'],
            columnNames: ['group_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'UserToSecretFriend',
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'UserToSecretFriend2',
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
    await queryRunner.dropForeignKey('secret_friend', 'GroupToSecretFriend');
    await queryRunner.dropForeignKey('secret_friend', 'UserToSecretFriend');

    await queryRunner.dropTable('secret_friend');
  }
}
