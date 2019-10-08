import {Optional} from "polar-shared/src/util/ts/Optional";

export class Platforms {

    /*
     *
     * The variable to use would be process.platform
     *
     * On Mac the variable returns darwin. On Windows, it returns win32 (even on 64 bit).
     *
     * Possible values are: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
     *
     * I just set this at the top of my jakeFile:
     *
     * var isWin = process.platform === "win32";
     */
    public static get(): Platform {

        return Optional.first<Platform>(() => this.getWithUserAgent(),
                                        () => this.getWithProcessPlatform()).getOrElse(Platform.UNKNOWN);

    }

    private static currentUserAgent() {
        return typeof navigator !== 'undefined' ? navigator.userAgent : undefined;
    }

    /**
     * @VisibleForTesting
     */
    public static getWithUserAgent(userAgent: string | undefined = this.currentUserAgent()): Platform | undefined {

        if (userAgent) {

            interface UserAgentMap {
                [key: string]: Platform;
            }

            const userAgentMap: UserAgentMap = {
                "MacIntel":  Platform.MACOS,
                "MacPPC":    Platform.MACOS,
                "Android":   Platform.ANDROID,
                "iPhone":    Platform.IOS,
                "iPad":      Platform.IOS,
                "Linux":     Platform.LINUX,
                "Win32":     Platform.WINDOWS,
                "Win64":     Platform.WINDOWS,
            };

            if (userAgent) {

                for (const key of Object.keys(userAgentMap)) {

                    if (userAgent.indexOf(key) !== -1) {
                        return userAgentMap[key];
                    }

                }

            }

        }

        return undefined;

    }

    private static currentProcessPlatform() {
        return typeof process !== 'undefined' && process.platform ? process.platform : undefined;
    }

    /**
     * @VisibleForTesting
     */
    public static getWithProcessPlatform(processPlatform: NodeJS.Platform | undefined = this.currentProcessPlatform()): Platform | undefined {

        if (processPlatform) {

            // NodeJS and Electron

            switch (processPlatform.toLowerCase()) {

                case 'win32':
                    return Platform.WINDOWS;

                case 'darwin':
                    return Platform.MACOS;

                case 'linux':
                    return Platform.LINUX;

            }

        }

        return undefined;

    }

    /**
     * Return the platform type (desktop or mobile)
     */
    public static type(): PlatformType {

        const platform = this.get();

        if ([Platform.MACOS, Platform.WINDOWS, Platform.LINUX].includes(platform)) {
            return 'desktop';
        }

        if ([Platform.ANDROID, Platform.IOS].includes(platform)) {
            return 'mobile';
        }

        return 'unknown';

    }

    public static isMobile() {
        return this.type() === 'mobile';
    }

    public static isDesktop() {
        return this.type() === 'desktop';
    }

    /**
     * Get the symbol name for the enum.
     */
    public static toSymbol<T>(value: PlatformEnumType) {
        return Platform[value];
    }

}

export enum Platform {
    MACOS,
    WINDOWS,
    LINUX,
    ANDROID,
    IOS,
    UNKNOWN
}

export type PlatformEnumType
    = Platform.WINDOWS |
      Platform.MACOS |
      Platform.LINUX |
      Platform.ANDROID |
      Platform.IOS |
      Platform.UNKNOWN;

export type PlatformType = 'desktop' | 'mobile' | 'unknown';
