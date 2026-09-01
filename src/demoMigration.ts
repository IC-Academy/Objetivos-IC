const DEMO_VERSION = "2026-09-01-executive-v2";
const versionKey = "oc-demo-version";

if (localStorage.getItem(versionKey) !== DEMO_VERSION) {
  localStorage.removeItem("oc-projects");
  localStorage.removeItem("oc-tasks");
  localStorage.removeItem("oc-requests");
  localStorage.setItem(versionKey, DEMO_VERSION);
}
