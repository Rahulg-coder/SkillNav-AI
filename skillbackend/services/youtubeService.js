const axios = require("axios");

const YOUTUBE_API_KEY =
  process.env.YOUTUBE_API_KEY;


// =====================================================
// OFFICIAL DOCUMENTATION MAP
// NO GOOGLE CUSTOM SEARCH API REQUIRED
// =====================================================

const documentationMap = [

  // FRONTEND
  {
    keywords: ["react", "react.js", "reactjs"],
    title: "React Official Documentation",
    url: "https://react.dev/",
    description:
      "Official React documentation covering components, hooks, state, and modern React development.",
  },

  {
    keywords: ["javascript", "js", "ecmascript"],
    title: "MDN JavaScript Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    description:
      "Comprehensive JavaScript documentation covering language features, syntax, APIs, and browser programming.",
  },

  {
    keywords: ["html"],
    title: "MDN HTML Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    description:
      "Official HTML documentation covering elements, attributes, forms, and page structure.",
  },

  {
    keywords: ["css"],
    title: "MDN CSS Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    description:
      "Comprehensive CSS reference covering styling, layouts, selectors, responsive design, and animations.",
  },


  // BACKEND
  {
    keywords: ["node.js", "nodejs", "node"],
    title: "Node.js Official Documentation",
    url: "https://nodejs.org/docs/latest/api/",
    description:
      "Official Node.js documentation covering APIs, modules, HTTP servers, filesystem operations, and runtime features.",
  },

  {
    keywords: ["express", "express.js", "expressjs"],
    title: "Express.js Official Documentation",
    url: "https://expressjs.com/",
    description:
      "Official Express.js documentation covering routing, middleware, APIs, and web application development.",
  },

  {
    keywords: ["fastapi"],
    title: "FastAPI Official Documentation",
    url: "https://fastapi.tiangolo.com/",
    description:
      "Official FastAPI documentation covering APIs, validation, authentication, dependencies, and async programming.",
  },

  {
    keywords: ["python"],
    title: "Python Official Documentation",
    url: "https://docs.python.org/3/",
    description:
      "Official Python documentation covering the language, standard library, modules, and programming concepts.",
  },


  // DATABASE
  {
    keywords: ["mongodb", "mongo"],
    title: "MongoDB Official Documentation",
    url: "https://www.mongodb.com/docs/",
    description:
      "Official MongoDB documentation covering databases, collections, queries, aggregation, indexes, and data modeling.",
  },

  {
    keywords: ["mongoose"],
    title: "Mongoose Official Documentation",
    url: "https://mongoosejs.com/docs/",
    description:
      "Official Mongoose documentation covering schemas, models, validation, queries, and MongoDB integration.",
  },

  {
    keywords: ["postgresql", "postgres"],
    title: "PostgreSQL Official Documentation",
    url: "https://www.postgresql.org/docs/",
    description:
      "Official PostgreSQL documentation covering SQL, administration, indexing, transactions, and advanced features.",
  },

  {
    keywords: ["mysql"],
    title: "MySQL Official Documentation",
    url: "https://dev.mysql.com/doc/",
    description:
      "Official MySQL documentation covering SQL, database management, queries, optimization, and administration.",
  },

  {
    keywords: ["sequelize"],
    title: "Sequelize Official Documentation",
    url: "https://sequelize.org/docs/v6/",
    description:
      "Official Sequelize documentation covering ORM models, queries, associations, migrations, and database operations.",
  },


  // DEVOPS
  {
    keywords: ["docker"],
    title: "Docker Official Documentation",
    url: "https://docs.docker.com/",
    description:
      "Official Docker documentation covering containers, images, Dockerfiles, networking, volumes, and deployment.",
  },

  {
    keywords: ["kubernetes", "k8s"],
    title: "Kubernetes Official Documentation",
    url: "https://kubernetes.io/docs/",
    description:
      "Official Kubernetes documentation covering pods, deployments, services, networking, and orchestration.",
  },

  {
    keywords: ["git", "github"],
    title: "Git Documentation",
    url: "https://git-scm.com/doc",
    description:
      "Official Git documentation covering repositories, branches, commits, merging, and workflows.",
  },


  // CLOUD
  {
    keywords: ["aws", "amazon web services"],
    title: "AWS Documentation",
    url: "https://docs.aws.amazon.com/",
    description:
      "Official AWS documentation covering cloud services, deployment, storage, networking, security, and infrastructure.",
  },

  {
    keywords: ["google cloud", "gcp"],
    title: "Google Cloud Documentation",
    url: "https://cloud.google.com/docs",
    description:
      "Official Google Cloud documentation covering cloud services, deployment, storage, networking, and infrastructure.",
  },

  {
    keywords: ["azure", "microsoft azure"],
    title: "Microsoft Azure Documentation",
    url: "https://learn.microsoft.com/en-us/azure/",
    description:
      "Official Azure documentation covering cloud services, compute, storage, networking, security, and deployment.",
  },


  // SECURITY
  {
    keywords: ["jwt", "json web token", "authentication"],
    title: "JWT Official Documentation",
    url: "https://jwt.io/introduction",
    description:
      "JWT documentation explaining JSON Web Tokens, authentication, claims, signing, and token validation.",
  },

  {
    keywords: ["owasp", "web security", "application security"],
    title: "OWASP Official Documentation",
    url: "https://owasp.org/",
    description:
      "OWASP provides resources and guidance for secure web application development and application security.",
  },

  {
    keywords: ["linux"],
    title: "Linux Documentation",
    url: "https://docs.kernel.org/",
    description:
      "Linux kernel documentation covering system concepts, kernel APIs, configuration, and development.",
  },

];


// =====================================================
// NORMALIZE TEXT
// =====================================================

const normalizeText = (text = "") => {

  return String(text)
    .toLowerCase()
    .replace(/[^\w\s.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

};


// =====================================================
// FIND OFFICIAL DOCUMENTATION
// =====================================================

const findDocumentation = (resource = {}) => {

  const title =
    normalizeText(
      resource.title || ""
    );

  const searchQuery =
    normalizeText(
      resource.searchQuery || ""
    );

  const description =
    normalizeText(
      resource.description || ""
    );


  const fullText =
    `${title} ${searchQuery} ${description}`;


  if (!fullText.trim()) {
    return null;
  }


  // ===================================================
  // SCORE DOCUMENTATION MATCHES
  // ===================================================

  const results =
    documentationMap.map(
      (documentation) => {

        let score = 0;


        for (
          const keyword of documentation.keywords
        ) {

          const normalizedKeyword =
            normalizeText(keyword);


          if (!normalizedKeyword) {
            continue;
          }


          // -------------------------------------------
          // TITLE MATCH
          // -------------------------------------------

          if (
            title.includes(
              normalizedKeyword
            )
          ) {

            score += 100;

          }


          // -------------------------------------------
          // SEARCH QUERY MATCH
          // -------------------------------------------

          if (
            searchQuery.includes(
              normalizedKeyword
            )
          ) {

            score += 80;

          }


          // -------------------------------------------
          // DESCRIPTION MATCH
          // -------------------------------------------

          if (
            description.includes(
              normalizedKeyword
            )
          ) {

            score += 20;

          }

        }


        return {
          documentation,
          score,
        };

      }
    );


  // ===================================================
  // SORT BY BEST MATCH
  // ===================================================

  results.sort(
    (a, b) =>
      b.score - a.score
  );


  const best =
    results[0];


  if (
    !best ||
    best.score <= 0
  ) {

    console.log(
      "No documentation match found for:",
      fullText
    );

    return null;

  }


  console.log(
    "Documentation matched:",
    best.documentation.title,
    "Score:",
    best.score
  );


  return best.documentation;

};


// =====================================================
// SEARCH ONE YOUTUBE VIDEO
// =====================================================

const searchYouTubeVideo = async (query) => {

  try {

    if (!YOUTUBE_API_KEY) {

      console.error(
        "YOUTUBE_API_KEY is not configured"
      );

      return null;

    }


    if (!query) {
      return null;
    }


    console.log(
      "Searching YouTube for:",
      query
    );


    const response =
      await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {

            part: "snippet",

            q: query,

            key: YOUTUBE_API_KEY,

            maxResults: 1,

            type: "video",

            videoEmbeddable: "true",

            videoSyndicated: "true",

          },

          timeout: 15000,

        }
      );


    const items =
      response.data?.items || [];


    if (!items.length) {

      console.log(
        "No YouTube video found for:",
        query
      );

      return null;

    }


    const item = items[0];


    if (!item.id?.videoId) {
      return null;
    }


    const videoId =
      item.id.videoId;


    console.log(
      "YouTube video found:",
      videoId,
      item.snippet?.title
    );


    return {

      videoId,

      title:
        item.snippet?.title ||
        "Learning Video",

      channelTitle:
        item.snippet?.channelTitle ||
        "",

      description:
        item.snippet?.description ||
        "",

      thumbnail:
        item.snippet?.thumbnails?.high?.url ||
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.default?.url ||
        "",

      watchUrl:
        `https://www.youtube.com/watch?v=${videoId}`,

      embedUrl:
        `https://www.youtube.com/embed/${videoId}`,

    };


  } catch (error) {

    console.error(
      "YouTube search error:",
      error.response?.data ||
      error.message
    );

    return null;

  }

};


// =====================================================
// SEARCH DOCUMENTATION
// =====================================================

const searchDocumentation = async (resource) => {

  try {

    if (!resource) {
      return null;
    }


    console.log(
      "Searching official documentation for:",
      resource.title ||
      resource.searchQuery
    );


    const documentation =
      findDocumentation(resource);


    if (!documentation) {

      console.log(
        "No official documentation mapping found for:",
        resource.title ||
        resource.searchQuery
      );

      return null;

    }


    console.log(
      "Official documentation found:",
      documentation.title,
      documentation.url
    );


    return {

      title:
        documentation.title,

      url:
        documentation.url,

      description:
        documentation.description,

      displayLink:
        documentation.url,

      source:
        "official-documentation",

    };


  } catch (error) {

    console.error(
      "Documentation search error:",
      error.message
    );

    return null;

  }

};


// =====================================================
// ENRICH ALL LEARNING RESOURCES
// =====================================================

const enrichLearningResources = async (
  resources = []
) => {

  if (!Array.isArray(resources)) {
    return [];
  }


  const updatedResources = [];


  for (const resource of resources) {

    if (!resource) {
      continue;
    }


    // =================================================
    // VIDEO
    // =================================================

    if (
      resource.type === "video"
    ) {

      const query =
        resource.searchQuery ||
        resource.title ||
        "programming tutorial";


      const video =
        await searchYouTubeVideo(
          query
        );


      updatedResources.push({

        ...resource,

        video,

      });


      continue;

    }


    // =================================================
    // DOCUMENTATION
    // =================================================

    if (
      resource.type === "documentation" ||
      resource.type === "docs" ||
      resource.type === "document"
    ) {

      const documentation =
        await searchDocumentation(
          resource
        );


      updatedResources.push({

        ...resource,

        title:
          documentation?.title ||
          resource.title ||
          "Documentation",

        description:
          documentation?.description ||
          resource.description ||
          "Official documentation resource.",

        url:
          documentation?.url ||
          resource.url ||
          "",

        displayLink:
          documentation?.displayLink ||
          resource.url ||
          "",

        source:
          documentation?.source ||
          resource.source ||
          null,

      });


      continue;

    }


    // =================================================
    // UNKNOWN RESOURCE
    // =================================================

    updatedResources.push(
      resource
    );

  }


  return updatedResources;

};


// =====================================================
// BACKWARD COMPATIBILITY
// =====================================================

const searchYouTubeVideos = async (
  resources = []
) => {

  return enrichLearningResources(
    resources
  );

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  searchYouTubeVideo,

  searchDocumentation,

  enrichLearningResources,

  searchYouTubeVideos,

};