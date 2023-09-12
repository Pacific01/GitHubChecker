// content.js
// This code runs on all webpages

// Function to check if a URL is a GitHub link
function isGitHubRepositoryLink(url) {
  // Define a regular expression pattern to match GitHub repository URLs
  const githubRepoPattern = /^https:\/\/github\.com\/[^/]+\/[^/]+/i;
  return githubRepoPattern.test(url);
}

// Function to check if an element is within the visible viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to fetch the last commit date for a GitHub repository with authentication
async function fetchLastCommitDateWithAuth(repoUrl) {
  try {
    const apiUrl = `${repoUrl.replace("github.com", "api.github.com/repos")}/commits?per_page=1`;
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer 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`,
      },
    });
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const lastCommitDate = data[0].commit.author.date;
      return lastCommitDate;
    } else {
      return "No commits found.";
    }
  } catch (error) {
    console.error("Error fetching commit date:", error);
    return "Error fetching commit date.";
  }
}

// Function to find and log all GitHub repository links within the visible viewport along with their last commit dates
async function findVisibleGitHubRepositoryLinksAndCommitDatesWithAuth() {
  const allLinks = document.querySelectorAll("a"); // Get all <a> elements on the page

  const observer = new IntersectionObserver(async (entries, observer) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        const link = entry.target;
        const href = link.getAttribute("href"); // Get the href attribute of the link
        if (href && isGitHubRepositoryLink(href)) {
          const lastCommitDate = await fetchLastCommitDateWithAuth(href);
          console.log({ link: href, lastCommitDate });
          // Stop observing the link after it's processed to avoid duplicate requests
          observer.unobserve(link);
        }
      }
    });
  });

  allLinks.forEach((link) => {
    observer.observe(link);
  });
}

// Get and log all GitHub repository links within the visible viewport and their last commit dates with authentication
findVisibleGitHubRepositoryLinksAndCommitDatesWithAuth()
