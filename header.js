// ==========================
// Fetch week info and store
// ==========================
export async function fetchAndStoreWeek() {
    try {
        const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard");
        const data = await res.json();

        const week = data.week.number;
        const season = data.leagues[0].season.type.name;

        localStorage.setItem("currentWeek", week);
        localStorage.setItem("seasonType", season);

        return { week, season };
    } catch (err) {
        console.error("Error fetching week:", err);
        return null;
    }
}

// ==========================
// Populate week info in DOM if present
// ==========================
export function populateWeekInfo() {
    const currentWeekEl = document.getElementById("current-week");
    const seasonTypeEl = document.getElementById("season-type");

    const savedWeek = localStorage.getItem("currentWeek");
    const savedSeason = localStorage.getItem("seasonType");

    if (!savedWeek || !savedSeason) return;

    if (currentWeekEl) currentWeekEl.textContent = `Week ${savedWeek}`;
    if (seasonTypeEl) seasonTypeEl.textContent = savedSeason;
}

// ==========================
// Highlight active nav link
// ==========================
export function highlightActiveNav(page) {
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active", link.dataset.page === page);
    });
}

// ==========================
// Initialize header on DOM load
// ==========================
document.addEventListener("DOMContentLoaded", async () => {
    // Only fetch if not in localStorage
    if (!localStorage.getItem("currentWeek") || !localStorage.getItem("seasonType")) {
        await fetchAndStoreWeek();
    }
    populateWeekInfo();
});
