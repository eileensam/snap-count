// --------------------
// Loading overlay
// --------------------
const loadingScreen = document.createElement("div");
loadingScreen.id = "loading-screen";
loadingScreen.textContent = "Loading scores...";
Object.assign(loadingScreen.style, {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  color: "#fff",
  fontSize: "2rem",
  display: "none",
  alignItems: "center",
  justifyContent: "center",
  zIndex: "9999"
});
document.body.appendChild(loadingScreen);

export function showLoading() { loadingScreen.style.display = "flex"; }
export function hideLoading() { loadingScreen.style.display = "none"; }

