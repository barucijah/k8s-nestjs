import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from 'typeorm';

const mockResponse = (data: any) => {
  return () => new Promise((resolve) => {resolve(data)});
}


describe('AppController', () => {
  let appController: AppController;
  let connection: Connection;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, { provide: Connection, useValue: {query: mockResponse([])}}],
    }).compile();

    appController = app.get<AppController>(AppController);
    connection = app.get<Connection>(Connection);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      jest.spyOn(connection, 'query').mockImplementation(mockResponse([{version: "Latest version"}]));
      expect(await appController.getHello()).toContain('Hello World!');
    });

    it('should return "Last version"', async () => {
      jest.spyOn(connection, 'query').mockImplementation(mockResponse([{version: "Last version"}]));
      expect(await appController.getHello()).toContain('Last version');
    });

    it('should return "unknown', async () => {
      expect(await appController.getHello()).toContain('unknown');
    });
  });
});
