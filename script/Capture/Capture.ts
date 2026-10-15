// Capture.ts
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Captures a screenshot of a connected Android device.
 * 
 * @param destinationPath - The absolute or relative path where the image will be saved
 * @param deviceId - (Optional) Specific device ID if multiple devices are connected
 */
export async function captureDeviceScreenshot(destinationPath: string, deviceId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // Ensure the destination directory exists
        const dir = path.dirname(destinationPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Build the ADB command
        // 'exec-out screencap -p' streams a PNG directly to the host machine
        const deviceFlag = deviceId ? `-s ${deviceId}` : '';
        const command = `adb ${deviceFlag} exec-out screencap -p > "${destinationPath}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Failed to capture screenshot: ${error.message}`);
                return reject(error);
            }
            
            console.log(`Screenshot successfully saved to: ${destinationPath}`);
            resolve();
        });
    });
}

// --- Direct Execution ---
// Supports both Node (require.main === module) and Bun (import.meta.main)
if ((typeof require !== 'undefined' && require.main === module) || (import.meta as any).main) {
    // Save to "Cap" folder inside current directory
    const capDir = path.join(__dirname, 'Cap');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const saveLocation = path.join(capDir, `screenshot_${timestamp}.png`);

    console.log('Capturing screenshot...');
    captureDeviceScreenshot(saveLocation)
        .then(() => console.log('Capture process finished successfully.'))
        .catch((err) => console.error('Capture process failed.', err));
}