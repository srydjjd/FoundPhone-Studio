import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const mode = args[0] || "validate";
const template = resolve("stories/template/story.json");
const selected = resolve(args[1] || process.env.STORY_FILE || template);

if (selected !== template) {
  const child = spawn(process.execPath, ["scripts/story.mjs", ...args], {
    stdio: "inherit",
    env: process.env,
  });
  child.on("exit", (code) => process.exit(code ?? 1));
} else {
  const dir = await mkdtemp(join(tmpdir(), "foundphone-story-"));
  try {
    const story = JSON.parse(await readFile(template, "utf8"));
    const additions = JSON.parse(
      await readFile("stories/template/wechat-chat.json", "utf8"),
    );
    story.revision = (story.revision || 1) + 1;
    story.contacts = [...(story.contacts || []), ...additions.contacts];
    story.chats = [...(story.chats || []), ...additions.chats];
    const tempStory = join(dir, "story.json");
    await writeFile(tempStory, JSON.stringify(story, null, 2) + "\n");
    const child = spawn(
      process.execPath,
      ["scripts/story.mjs", mode, tempStory],
      { stdio: "inherit", env: process.env },
    );
    process.exitCode = await new Promise((resolveExit) =>
      child.on("exit", (code) => resolveExit(code ?? 1)),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
