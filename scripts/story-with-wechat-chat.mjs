import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const mode = args[0] || "validate";
const storyPath = resolve(
  args[1] || process.env.STORY_FILE || "stories/template/story.json",
);
const templatePath = resolve("stories/template/story.json");

// Keep custom story paths unchanged; only layer the fork's authoring data onto
// the existing default template used by preview and production builds.
if (storyPath !== templatePath) {
  const result = spawnSync(process.execPath, ["scripts/story.mjs", ...args], {
    stdio: "inherit",
    env: process.env,
  });
  process.exitCode = result.status ?? 1;
} else {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "foundphone-story-"));
  try {
    const base = JSON.parse(readFileSync(templatePath, "utf8"));
    const chatAdditions = JSON.parse(
      readFileSync("stories/template/wechat-chat.json", "utf8"),
    );
    const contentAdditions = JSON.parse(
      readFileSync("stories/template/content-additions.json", "utf8"),
    );

    base.revision = (base.revision || 1) + 1;
    base.contacts = (base.contacts || []).filter(
      (contact) => !contact.id.startsWith("test-"),
    );
    base.chats = (base.chats || []).filter((chat) => !chat.id.startsWith("test-"));
    base.content = Object.fromEntries(
      Object.entries(base.content || {})
        .map(([app, items]) => [
          app,
          (Array.isArray(items) ? items : []).filter(
            (item) =>
              !item.id.startsWith("test-") &&
              item.title !== "测试内容" &&
              !String(item.body || "").startsWith("这是一条测试"),
          ),
        ])
        .filter(([, items]) => Array.isArray(items) && items.length > 0),
    );

    base.contacts = [...base.contacts, ...chatAdditions.contacts];
    base.chats = [...base.chats, ...chatAdditions.chats];
    base.content = { ...base.content, ...contentAdditions.content };
    const mergedPath = join(temporaryDirectory, "story.json");
    writeFileSync(mergedPath, JSON.stringify(base, null, 2) + "\n");
    const result = spawnSync(
      process.execPath,
      ["scripts/story.mjs", mode, mergedPath],
      { stdio: "inherit", env: process.env },
    );
    process.exitCode = result.status ?? 1;
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}
