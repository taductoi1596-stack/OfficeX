import { describe, it, expect, beforeEach } from 'vitest';
import { ServiceContainer } from './container';
import { injectable } from 'tsyringe';

@injectable()
class TestService {
  public value = 42;
}

describe('ServiceContainer', () => {
  beforeEach(() => {
    ServiceContainer.clear();
  });

  it('should resolve a registered service', () => {
    ServiceContainer.registerSingleton(TestService, TestService);
    const instance = ServiceContainer.resolve<TestService>(TestService);
    
    expect(instance).toBeDefined();
    expect(instance.value).toBe(42);
  });

  it('should return the same instance for singletons', () => {
    ServiceContainer.registerSingleton(TestService, TestService);
    
    const instance1 = ServiceContainer.resolve<TestService>(TestService);
    const instance2 = ServiceContainer.resolve<TestService>(TestService);
    
    instance1.value = 100;
    
    expect(instance1).toBe(instance2);
    expect(instance2.value).toBe(100);
  });
});
