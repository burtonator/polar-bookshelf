"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SpectronRenderer_1 = require("../../js/test/SpectronRenderer");
const ProgressBar_1 = require("../../js/ui/progress_bar/ProgressBar");
SpectronRenderer_1.SpectronRenderer.run(() => __awaiter(this, void 0, void 0, function* () {
    const intervals = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    let remaining = Object.assign([], intervals);
    const progressBar = ProgressBar_1.ProgressBar.create(false);
    const timeout = 500;
    function updateProgress() {
        if (remaining.length === 0) {
            remaining = Object.assign([], intervals);
        }
        progressBar.update(remaining.shift());
        setTimeout(updateProgress, 500);
    }
    setTimeout(updateProgress, 500);
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUFnRTtBQUNoRSxzRUFBaUU7QUFFakUsbUNBQWdCLENBQUMsR0FBRyxDQUFDLEdBQVMsRUFBRTtJQUU1QixNQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUUvRCxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUU3QyxNQUFNLFdBQVcsR0FBRyx5QkFBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUU3QyxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFFcEIsU0FBUyxjQUFjO1FBRW5CLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDeEIsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQzVDO1FBRUQsV0FBVyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFHLENBQUMsQ0FBQztRQUV2QyxVQUFVLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRXBDLENBQUM7SUFFRCxVQUFVLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRXBDLENBQUMsQ0FBQSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NwZWN0cm9uUmVuZGVyZXJ9IGZyb20gJy4uLy4uL2pzL3Rlc3QvU3BlY3Ryb25SZW5kZXJlcic7XG5pbXBvcnQge1Byb2dyZXNzQmFyfSBmcm9tICcuLi8uLi9qcy91aS9wcm9ncmVzc19iYXIvUHJvZ3Jlc3NCYXInO1xuXG5TcGVjdHJvblJlbmRlcmVyLnJ1bihhc3luYyAoKSA9PiB7XG5cbiAgICBjb25zdCBpbnRlcnZhbHMgPSBbMCwgMTAsIDIwLCAzMCwgNDAsIDUwLCA2MCwgNzAsIDgwLCA5MCwgMTAwXTtcblxuICAgIGxldCByZW1haW5pbmcgPSBPYmplY3QuYXNzaWduKFtdLCBpbnRlcnZhbHMpO1xuXG4gICAgY29uc3QgcHJvZ3Jlc3NCYXIgPSBQcm9ncmVzc0Jhci5jcmVhdGUoZmFsc2UpXG5cbiAgICBjb25zdCB0aW1lb3V0ID0gNTAwO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlUHJvZ3Jlc3MoKSB7XG5cbiAgICAgICAgaWYgKHJlbWFpbmluZy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJlbWFpbmluZyA9IE9iamVjdC5hc3NpZ24oW10sIGludGVydmFscyk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm9ncmVzc0Jhci51cGRhdGUocmVtYWluaW5nLnNoaWZ0KCkhKTtcblxuICAgICAgICBzZXRUaW1lb3V0KHVwZGF0ZVByb2dyZXNzLCA1MDApO1xuXG4gICAgfVxuXG4gICAgc2V0VGltZW91dCh1cGRhdGVQcm9ncmVzcywgNTAwKTtcblxufSk7XG5cblxuXG5cbiJdfQ==