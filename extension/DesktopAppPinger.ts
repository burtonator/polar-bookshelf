
/**
 * Background 'task' that sends 'ping' requests to the desktop app continually
 * to detect its state.
 */
class DesktopAppPinger {

    // TODO: instead of constantly pinging maybe we could ping when we need
    // the app.  We could have a way to just directly fetch the state.

    // the state of the desktop app, initially inactive
    private state: DesktopAppState = 'inactive';

    private static UPDATE_TIMEOUT: number = 1000;

    public start(): void {

        setTimeout(() => {

            this.update()
                .catch(err => console.error("Unable to start updating: ", err));

        }, 1);

    }

    public getState(): DesktopAppState {
        return this.state;
    }

    /**
     * Update the state by sending a ping.
     */
    private async update() {

        // TODO: there should be a better way to handle distributing state
        // information from the desktop app to the chrome extension but don't
        // want anything too complicated for now.

        try {
            await this.sendPing();
            this.state = 'active';
        } catch (e) {
            // noop as this is normal and we just have to update the state
            this.state = 'inactive';
        } finally {
            // now continually ping in the background
            setTimeout(() => this.update(), DesktopAppPinger.UPDATE_TIMEOUT);
        }

    }

    /**
     * Send a ping request to Polar to make sure it's active locally and when
     * it's not active we can't capture the URL and perform other desktop
     * tasks.
     */
    private async sendPing(): Promise<void> {

        const url = 'http://localhost:8500/rest/v1/ping';

        return new Promise<void>((resolve, reject) => {

            // For some reason the fetch API doesn't work and we have to hse XHR
            // for this functionality.

            const xrequest = new XMLHttpRequest();
            xrequest.open("POST", url);

            xrequest.onload = () => {
                resolve();
            };

            xrequest.onerror = () => {
                const {status, responseText} = xrequest;
                reject(new Error(`Request failed to: ${url} ${status}: ${responseText}`));
            };

            xrequest.send();

        });

    }


}

interface PingResponse {
    readonly timestamp: number;
    readonly version: string;
}


type DesktopAppState = 'active' | 'inactive';
