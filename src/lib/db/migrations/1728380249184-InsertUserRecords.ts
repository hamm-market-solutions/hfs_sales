import { MigrationInterface, QueryRunner } from "typeorm";

import { appConfig } from "@/config/app";

export class InsertUserRecords1728380249184 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (appConfig.env !== "development") {
      return;
    }

    await queryRunner.query(`
      INSERT INTO user (fname,name,password,email,passwordcode,passwordcode_time) VALUES
        ('Steffen','Konermann','$2y$10$AKZ65hWmHJiScWCLwBFLoeZ5zX2TfRu3yRqxXyIw4heJbFoacf3cy','steffen.konermann@hamm-footwear.com',NULL,NULL),
        ('Arne','Hilbrand','$2y$10$8R4iip8LNaB/nJ0AAWuGuuDmRTkKGyO5kSxVIeedADtb0kLpxCbQi','arne.hilbrand@hamm-footwear.com','771675a82f42bad80afb102f172eba4943dd068c','2024-02-20 10:32:26'),
        ('purchase','purchase','$2y$10$73VAgu8pYrkMq6g6lrMvD.GCzcDDgiqxdo9an65e69opCCUap52sK','purchase@hfs.local',NULL,NULL),
        ('sales','sales','$2y$10$73VAgu8pYrkMq6g6lrMvD.GCzcDDgiqxdo9an65e69opCCUap52sK','sales@hfs.local',NULL,NULL),
        ('vendor','vendor','$2y$10$73VAgu8pYrkMq6g6lrMvD.GCzcDDgiqxdo9an65e69opCCUap52sK','vendor@hfs.local',NULL,NULL),
        ('admin','admin','$2y$10$rWvKaB6CsWAk05sEzV0NIuD73DL07O6BSpbXZvLBdQ2JObamusYWK','admin@hfs.local',NULL,NULL);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (appConfig.env !== "development") {
      return;
    }

    // delete all records
    await queryRunner.query(`
        DELETE FROM user;
    `);
  }
}
