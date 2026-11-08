import 'reflect-metadata';
import { container } from 'tsyringe';

export class ServiceContainer {
  static resolve<T>(token: any): T {
    return container.resolve<T>(token);
  }

  static registerSingleton<T>(token: any, provider: any) {
    container.registerSingleton(token, provider);
  }

  static register<T>(token: any, provider: any) {
    container.register(token, { useClass: provider });
  }

  static clear() {
    container.clearInstances();
  }
}
