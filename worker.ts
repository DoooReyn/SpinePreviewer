import { SizeHint, Webview } from "webview-bun";

const webview = new Webview();
webview.title = "Spine预览";
webview.size = { width: 960, height: 640, hint: SizeHint.MIN };
webview.navigate("http://localhost:3005/");
webview.run();
