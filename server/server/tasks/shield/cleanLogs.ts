import { readdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';

export default defineTask({
  meta: {
    name: 'shield:cleanLogs',
    description: 'Delete shield log files older than 7 days.'
  },
  async run() {
    const logsDir = join(process.cwd(), 'logs');
    const RETENTION_DAYS = 7;
    const now = Date.now();
    let cleanedCount = 0;

    let files: string[];
    try {
      files = await readdir(logsDir);
    } catch {
      return { result: { cleanedCount: 0, status: 'logs_dir_not_found' } };
    }

    for (const file of files) {
      const match = file.match(/^shield-(\d{4})(\d{2})(\d{2})\.log$/);
      if (!match) continue;

      const [, year, month, day] = match;
      const fileDate = new Date(Number(year), Number(month) - 1, Number(day));
      const ageDays = (now - fileDate.getTime()) / (1000 * 60 * 60 * 24);

      if (ageDays > RETENTION_DAYS) {
        await unlink(join(logsDir, file));
        cleanedCount++;
      }
    }

    console.log(`[shield:cleanLogs] Cleaned ${cleanedCount} old log file(s).`);
    return { result: { cleanedCount } };
  }
});
