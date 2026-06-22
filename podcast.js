// =============================================
// Fabric Podcast - Reads latest Fabric Updates blog posts aloud
// =============================================

(function () {
  const FEED_URL = "https://community.fabric.microsoft.com/oxcrx34285/rss/board?board.id=fbc_fabricupdatesblogs";
  const MAX_EPISODES = 8;

  const state = {
    episodes: [],
    currentIndex: 0,
    isPlaying: false,
    isPaused: false,
    startedAutoPlay: false,
  };

  const els = {
    play: document.getElementById("podcast-play"),
    pause: document.getElementById("podcast-pause"),
    next: document.getElementById("podcast-next"),
    status: document.getElementById("podcast-status"),
    list: document.getElementById("podcast-episodes"),
  };

  if (!els.play || !els.pause || !els.next || !els.status || !els.list) {
    return;
  }

  function sanitizeText(value) {
    return (value || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  async function fetchFeedText() {
    const direct = fetch(FEED_URL, { method: "GET" }).then((r) => {
      if (!r.ok) {
        throw new Error("Direct RSS fetch failed");
      }
      return r.text();
    });

    const viaProxy = fetch(
      "https://api.allorigins.win/raw?url=" + encodeURIComponent(FEED_URL),
      { method: "GET" }
    ).then((r) => {
      if (!r.ok) {
        throw new Error("Proxy RSS fetch failed");
      }
      return r.text();
    });

    try {
      return await direct;
    } catch (_err) {
      return viaProxy;
    }
  }

  function parseEpisodes(xmlText) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");
    const items = Array.from(xml.querySelectorAll("item")).slice(0, MAX_EPISODES);

    return items
      .map((item) => {
        const title = sanitizeText(item.querySelector("title")?.textContent);
        const link = sanitizeText(item.querySelector("link")?.textContent);
        const description = sanitizeText(item.querySelector("description")?.textContent);

        if (!title) {
          return null;
        }

        return {
          title,
          link,
          description,
        };
      })
      .filter(Boolean);
  }

  function renderEpisodes() {
    els.list.innerHTML = "";

    state.episodes.forEach((ep, idx) => {
      const li = document.createElement("li");
      li.dataset.index = String(idx);

      const anchor = document.createElement("a");
      anchor.href = ep.link || "#";
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = ep.title;

      li.appendChild(anchor);
      els.list.appendChild(li);
    });

    highlightCurrentEpisode();
  }

  function highlightCurrentEpisode() {
    Array.from(els.list.querySelectorAll("li")).forEach((li) => {
      li.classList.remove("is-playing");
    });

    const current = els.list.querySelector(`li[data-index="${state.currentIndex}"]`);
    if (current) {
      current.classList.add("is-playing");
    }
  }

  function updateStatus(message) {
    els.status.textContent = message;
  }

  function currentEpisodeText() {
    const ep = state.episodes[state.currentIndex];
    if (!ep) {
      return "";
    }

    const snippet = ep.description
      ? ep.description.slice(0, 280)
      : "Open the post for details.";

    return `Fabric Updates podcast. Episode ${state.currentIndex + 1}. ${ep.title}. ${snippet}`;
  }

  function stopSpeaking() {
    window.speechSynthesis.cancel();
    state.isPlaying = false;
    state.isPaused = false;
  }

  function speakCurrentEpisode() {
    if (!state.episodes.length) {
      updateStatus("No podcast episodes available.");
      return;
    }

    stopSpeaking();
    highlightCurrentEpisode();

    const utterance = new SpeechSynthesisUtterance(currentEpisodeText());
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = function () {
      state.isPlaying = true;
      state.isPaused = false;
      const title = state.episodes[state.currentIndex]?.title || "";
      updateStatus(`Now playing: ${title}`);
    };

    utterance.onend = function () {
      state.isPlaying = false;
      state.isPaused = false;

      if (state.currentIndex < state.episodes.length - 1) {
        state.currentIndex += 1;
        speakCurrentEpisode();
      } else {
        updateStatus("Podcast finished. Press Play Latest to replay.");
      }
    };

    utterance.onerror = function () {
      state.isPlaying = false;
      state.isPaused = false;
      updateStatus("Audio playback hit an issue. Press Play Latest to retry.");
    };

    window.speechSynthesis.speak(utterance);
  }

  function playPodcast() {
    if (!state.episodes.length) {
      updateStatus("Still loading episodes. Please wait...");
      return;
    }

    if (state.isPaused) {
      window.speechSynthesis.resume();
      state.isPaused = false;
      state.isPlaying = true;
      updateStatus("Resumed podcast playback.");
      return;
    }

    speakCurrentEpisode();
  }

  function pausePodcast() {
    if (!state.isPlaying) {
      return;
    }
    window.speechSynthesis.pause();
    state.isPaused = true;
    state.isPlaying = false;
    updateStatus("Podcast paused.");
  }

  function nextEpisode() {
    if (!state.episodes.length) {
      return;
    }

    state.currentIndex = (state.currentIndex + 1) % state.episodes.length;
    speakCurrentEpisode();
  }

  async function initPodcast() {
    els.play.addEventListener("click", playPodcast);
    els.pause.addEventListener("click", pausePodcast);
    els.next.addEventListener("click", nextEpisode);

    try {
      const feedText = await fetchFeedText();
      state.episodes = parseEpisodes(feedText);

      if (!state.episodes.length) {
        updateStatus("No recent blog posts found in the feed.");
        return;
      }

      renderEpisodes();
      updateStatus(`Loaded ${state.episodes.length} latest Fabric Updates posts.`);

      // Auto-start playback once posts are loaded.
      if (!state.startedAutoPlay) {
        state.startedAutoPlay = true;
        speakCurrentEpisode();
      }
    } catch (_err) {
      updateStatus("Could not load the Fabric Updates feed right now.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPodcast);
  } else {
    initPodcast();
  }
})();
