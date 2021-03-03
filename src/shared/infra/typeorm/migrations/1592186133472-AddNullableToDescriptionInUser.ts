import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddNullableToDescriptionInUser1592186133472
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user',
      'description',
      new TableColumn({
        name: 'description',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user',
      'description',
      new TableColumn({
        name: 'description',
        type: 'varchar',
        length: '500',
      }),
    );
  }
}
