/**
 * Write mock PHZ data to a file we can work with.
 */
import {MockCapturedContent} from '../capture/MockCapturedContent';
import {CapturedPHZWriter} from '../capture/CapturedPHZWriter';

export class MockPHZWriter {

    public static async write(path: string) {

        const captured = MockCapturedContent.create();

        const capturedPHZWriter = new CapturedPHZWriter(path);
        await capturedPHZWriter.convert(captured);

    }

}
