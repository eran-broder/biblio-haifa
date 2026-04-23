export enum Platform {
  Windows = 'win32',
  Mac = 'darwin',
  Linux = 'linux',
}

export function currentPlatform(): Platform {
  switch (process.platform) {
    case 'win32':
      return Platform.Windows;
    case 'darwin':
      return Platform.Mac;
    default:
      return Platform.Linux;
  }
}
