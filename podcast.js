// =============================================
// Fabric Podcast - Reads latest Fabric Updates blog posts aloud
// =============================================

(function () {
  const FEED_URL = "https://community.fabric.microsoft.com/oxcrx34285/rss/board?board.id=fbc_fabricupdatesblogs";
  const MAX_EPISODES = 8;
  const FETCH_TIMEOUT_MS = 8000;

  const FEED_SOURCES = [
    {
      name: "allorigins-raw",
      buildUrl: function () {
        return "https://api.allorigins.win/raw?url=" + encodeURIComponent(FEED_URL);
      },
      extractText: function (text) {
        return text;
      },
    },
    {
      name: "allorigins-json",
      buildUrl: function () {
        return "https://api.allorigins.win/get?url=" + encodeURIComponent(FEED_URL);
      },
      extractText: function (text) {
        const parsed = JSON.parse(text);
        return parsed && parsed.contents ? parsed.contents : "";
      },
    },
    {
      name: "jina-reader",
      buildUrl: function () {
        return "https://r.jina.ai/http://community.fabric.microsoft.com/oxcrx34285/rss/board?board.id=fbc_fabricupdatesblogs";
      },
      extractText: function (text) {
        return text;
      },
    },
    {
      name: "direct",
      buildUrl: function () {
        return FEED_URL;
      },
      extractText: function (text) {
        return text;
      },
    },
  ];

  const FALLBACK_EPISODES = [
    {
      title: "Fabric June 2026 Feature Summary",
      link: "https://community.fabric.microsoft.com/t5/Fabric-Updates-Blog/Fabric-June-2026-Feature-Summary/ba-p/5190690",
      description: "Monthly roundup of major Microsoft Fabric updates and new capabilities.",
    },
    {
      title: "Monitoring weather conditions in real-time using AI and Fabric Eventstream",
      link: "https://community.fabric.microsoft.com/t5/Fabric-Updates-Blog/Monitoring-weather-conditions-in-real-time-using-AI-and-Fabric/ba-p/5197906",
      description: "How to build real-time weather monitoring with Eventstream and AI skills.",
    },
    {
      title: "Introducing Rayfin: A new AI-first way to build, deploy, and govern application backends",
      link: "https://community.fabric.microsoft.com/t5/Fabric-Updates-Blog/Introducing-Rayfin-A-new-AI-first-way-to-build-deploy-and-govern/ba-p/5191676",
      description: "New AI-first backend development approach announced for Fabric scenarios.",
    },
  ];

  const state = {
    episodes: [],
    currentIndex: 0,
    isPlaying: false,
    isPaused: false,
    startedAutoPlay: false,
    isLoading: true,
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

  function updateStatus(message) {
    els.status.textContent = message;
  }

  function fetchWithTimeout(url, timeoutMs) {
    return new Promise(function (resolve, reject) {
      const timer = setTimeout(function () {
        reject(new Error("Fetch timed out"));
      }, timeoutMs);

      fetch(url, { method: "GET" })
        .then(function (response) {
          clearTimeout(timer);
          resolve(response);
        })
        .catch(function (err) {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  async function fetchFeedTextFromSource(source) {
    const response = await fetchWithTimeout(source.buildUrl(), FETCH_TIMEOUT_MS);
    if (!response.ok) {
      throw new Error("RSS fetch failed for source: " + source.name);
    }
    const rawText = await response.text();
    const extracted = source.extractText(rawText);
    if (!extracted || !extracted.trim()) {
      throw new Error("RSS source returned empty content: " + source.name);
    }
    return extracted;
  }

  async function fetchFeedText() {
    let lastError = null;
    for (const source of FEED_SOURCES) {
      try {
        return await fetchFeedTextFromSource(source);
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error("All feed sources failed");
  }

  function parseEpisodes(xmlText) {
    const parser = new DOMParser();
    // =============================================
    // Fabric Podcast - Reads latest Fabric Updates blog posts aloud
    // =============================================

    (function () {
      const FEED_URL = "https://community.fabric.microsoft.com/oxcrx34285/rss/board?board.id=fbc_fabricupdatesblogs";
      const MAX_EPISODES = 8;
      const FETCH_TIMEOUT_MS = 10000;

      const FEED_SOURCES = [
        {
          name: "direct",
          buildUrl: function () {
            return FEED_URL;
          },
          extractText: function (text) {
            return text;
          },
        },
        {
          name: "allorigins-raw",
          buildUrl: function () {
            return "https://api.allorigins.win/raw?url=" + encodeURIComponent(FEED_URL);
          },
          extractText: function (text) {
            return text;
          },
        },
        {
          name: "allorigins-json",
          buildUrl: function () {
            return "https://api.allorigins.win/get?url=" + encodeURIComponent(FEED_URL);
          },
          extractText: function (text) {
            const parsed = JSON.parse(text);
            return parsed && parsed.contents ? parsed.contents : "";
          },
        },
        {
          name: "jina-reader",
          buildUrl: function () {
            return "https://r.jina.ai/http://community.fabric.microsoft.com/oxcrx34285/rss/board?board.id=fbc_fabricupdatesblogs";
          },
          extractText: function (text) {
            return text;
          },
        },
      ];

      const FALLBACK_EPISODES = [
        {
          title: "Fabric June 2026 Feature Summary",
          link: "https://community.fabric.microsoft.com/t5/Fabric-Updates-Blog/Fabric-June-2026-Feature-Summary/ba-p/5190690",
          description: "Monthly roundup of major Microsoft Fabric updates and new capabilities.",
        },
        {
          title: "Monitoring weather conditions in real-time using AI and Fabric Eventstream",
          link: "https://community.fabric.microsoft.com/t5/Fabric-Updates-Blog/Monitoring-weather-conditions-in-real-time-using-AI-and-Fabric/ba-p/5197906",
          description: "How to build real-time weather monitoring with Eventstream and AI skills.",
        },
        {
          title: "Introducing Rayfin: A new AI-first way to build, deploy, and govern application backends",
          link: "https://community.fabric.microsoft.com/t5/Fabric-Updates-Blog/Introducing-Rayfin-A-new-AI-first-way-to-build-deploy-and-govern/ba-p/5191676",
          description: "New AI-first backend development approach announced for Fabric scenarios.",
        },
      ];

      const state = {
        episodes: [],
        currentIndex: 0,
        isPlaying: false,
        isPaused: false,
        startedAutoPlay: false,
        isLoading: true,
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

      function updateStatus(message) {
        els.status.textContent = message;
      }

      function fetchWithTimeout(url, timeoutMs) {
        return new Promise(function (resolve, reject) {
          const timer = setTimeout(function () {
            reject(new Error("Fetch timed out"));
          }, timeoutMs);

          fetch(url, { method: "GET" })
            .then(function (response) {
              clearTimeout(timer);
              resolve(response);
            })
            .catch(function (err) {
              clearTimeout(timer);
              reject(err);
            });
        });
      }

      async function fetchFeedTextFromSource(source) {
        const response = await fetchWithTimeout(source.buildUrl(), FETCH_TIMEOUT_MS);
        if (!response.ok) {
          throw new Error("RSS fetch failed for source: " + source.name);
        }

        const rawText = await response.text();
        const extracted = source.extractText(rawText);
        if (!extracted || !extracted.trim()) {
          throw new Error("RSS source returned empty content: " + source.name);
        }

        return extracted;
      }

      async function fetchFeedText() {
        let lastError = null;

        for (const source of FEED_SOURCES) {
          try {
            return await fetchFeedTextFromSource(source);
          } catch (err) {
            lastError = err;
          }
        }

        throw lastError || new Error("All feed sources failed");
      }

      function parseEpisodes(xmlText) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "application/xml");

        if (xml.querySelector("parsererror")) {
          throw new Error("Feed content was not valid XML");
        }

        const items = Array.from(xml.querySelectorAll("item")).slice(0, MAX_EPISODES);
        return items
          .map(function (item) {
            const title = sanitizeText(item.querySelector("title")?.textContent);
            const link = sanitizeText(item.querySelector("link")?.textContent);
            const description = sanitizeText(item.querySelector("description")?.textContent);

            if (!title) {
              return null;
            }

            return { title: title, link: link, description: description };
          })
          .filter(Boolean);
      }

      function renderEpisodes() {
        els.list.innerHTML = "";

        state.episodes.forEach(function (ep, idx) {
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
        Array.from(els.list.querySelectorAll("li")).forEach(function (li) {
          li.classList.remove("is-playing");
        });

        const current = els.list.querySelector('li[data-index="' + state.currentIndex + '"]');
        if (current) {
          current.classList.add("is-playing");
        }
      }

      function loadFallbackEpisodes() {
        state.episodes = FALLBACK_EPISODES.slice(0, MAX_EPISODES);
        state.currentIndex = 0;
        renderEpisodes();
        updateStatus("Live feed unavailable. Loaded fallback Fabric playlist.");
      }

      function currentEpisodeText() {
        const ep = state.episodes[state.currentIndex];
        if (!ep) {
          return "";
        }

        const snippet = ep.description ? ep.description.slice(0, 280) : "Open the post for details.";
        return "Fabric Updates podcast. Episode " + (state.currentIndex + 1) + ". " + ep.title + ". " + snippet;
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
          updateStatus("Now playing: " + title);
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
        if (state.isLoading) {
          updateStatus("Loading episodes...");
          return;
        }

        if (!state.episodes.length) {
          updateStatus("No episodes available right now. Please try again shortly.");
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

        updateStatus("Loading latest episodes...");
        state.isLoading = true;

        try {
          const feedText = await fetchFeedText();
          state.episodes = parseEpisodes(feedText);

          if (!state.episodes.length) {
            loadFallbackEpisodes();
          } else {
            renderEpisodes();
            updateStatus("Loaded " + state.episodes.length + " latest Fabric Updates posts.");
          }

          if (!state.startedAutoPlay && state.episodes.length) {
            state.startedAutoPlay = true;
            speakCurrentEpisode();
          }
        } catch (_err) {
          loadFallbackEpisodes();

          if (!state.startedAutoPlay && state.episodes.length) {
            state.startedAutoPlay = true;
            speakCurrentEpisode();
          }
        } finally {
          state.isLoading = false;
        }
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPodcast);
      } else {
        initPodcast();
      }
    })();
