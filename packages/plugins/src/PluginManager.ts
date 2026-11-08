export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  permissions: string[];
}

export class PluginManager {
  private loadedPlugins: Map<string, PluginManifest> = new Map();

  public async loadPlugin(manifestPath: string): Promise<PluginManifest> {
    // Mock loading logic
    console.log(`Loading plugin from ${manifestPath}`);
    const manifest: PluginManifest = {
      id: 'ext-' + Date.now(),
      name: 'Mock Plugin',
      version: '1.0.0',
      permissions: ['document.read']
    };
    
    this.loadedPlugins.set(manifest.id, manifest);
    return manifest;
  }

  public unloadPlugin(id: string) {
    this.loadedPlugins.delete(id);
  }

  public getLoadedPlugins() {
    return Array.from(this.loadedPlugins.values());
  }
}
