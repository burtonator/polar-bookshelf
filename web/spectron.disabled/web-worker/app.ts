// import {SpectronRenderer} from '../../js/test/SpectronRenderer';
// import {createWorker, ITypedWorker} from './TypedWorker';
//
// SpectronRenderer.run(async () => {
//     console.log("Running within SpectronRenderer now.");
//
//
//     // Let us first define the `input` type for our Worker.
//     // In our simple example we are going to create a 'Values' interface.
//     interface Values {
//         x: number;
//         y: number;
//     }
//     // // Now we need to define the function that the worker will perform when it
//     // // receives a message of type `Values`.
//     // // We would expect it to look something like this
//     // function workFn(input: Values): number {
//     //     return input.x + input.y
//     // }
//
//     // However, as there are many use cases for when we would like to return
//     // multiple results from a single input or return results asynchronous.
//     // We have to modify our `workFn`.
//     // We will, basically, replace `return` with a function call.
//     function workFn(input: Values, callback: (_: number) => void): void {
//         callback(input.x + input.y);
//     }
//
//
//     // Now that our worker has calculated the sum of x and y, we should to do
//     // something with. Lets create a function that just logs the result.
//     // We could also call this function the `outputFn` or `handleResultFn`
//     function logFn(result: number) {
//         console.log(`We received this response from the worker: ${result}`);
//     }
//
//     // Lets put this all together and create our TypedWebWorker.
//     const typedWorker: ITypedWorker<Values, number> = createWorker(workFn, logFn);
//
//     console.log("Sending to the web worker.");
//
//     // Thats it! The Worker is now ready to process messages of type 'Values'
//     // and log the results to the console.
//     typedWorker.postMessage({ x: 5, y: 5 });
//     typedWorker.postMessage({ x: 0, y: 0 });
//
//
// });
