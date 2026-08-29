// =====================================================
// OFFICIAL DOCUMENTATION SERVICE
// =====================================================
// No Google Custom Search API required.
//
// Resolves learning resources to official documentation
// URLs based on title / searchQuery.
// =====================================================


// =====================================================
// DOCUMENTATION MAP
// =====================================================

const documentationMap = [

  // ===================================================
  // FRONTEND
  // ===================================================

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
      "Official reference for HTML elements, attributes, forms, semantic markup, and web page structure.",
  },

  {
    keywords: ["css"],
    title: "MDN CSS Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    description:
      "Comprehensive CSS reference covering styling, layouts, selectors, responsive design, and animations.",
  },


  // ===================================================
  // BACKEND
  // ===================================================

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
      "Official FastAPI documentation covering APIs, request validation, authentication, dependency injection, and async programming.",
  },

  {
    keywords: ["python"],
    title: "Python Official Documentation",
    url: "https://docs.python.org/3/",
    description:
      "Official Python documentation covering the language, standard library, modules, and programming concepts.",
  },


  // ===================================================
  // DATABASE
  // ===================================================

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
      "Official PostgreSQL documentation covering SQL, database administration, indexing, transactions, and advanced features.",
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
      "Official Sequelize documentation covering ORM models, associations, migrations, queries, and CRUD operations.",
  },


  // ===================================================
  // WEB / HTTP
  // ===================================================

  {
    keywords: ["http", "https", "http fundamentals"],
    title: "MDN HTTP Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
    description:
      "MDN documentation covering HTTP requests, responses, methods, headers, status codes, caching, and security.",
  },

  {
    keywords: ["rest api", "restful api", "rest api design"],
    title: "MDN Web APIs Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/API",
    description:
      "Documentation covering web APIs, HTTP communication, requests, responses, and browser-based API development.",
  },

  {
    keywords: ["fetch api", "fetch"],
    title: "MDN Fetch API Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
    description:
      "Documentation for the Fetch API used to make HTTP requests from web applications.",
  },


  // ===================================================
  // AUTHENTICATION
  // ===================================================

  {
    keywords: ["jwt", "json web token"],
    title: "JWT Official Documentation",
    url: "https://www.jwt.io/introduction",
    description:
      "Documentation explaining JSON Web Tokens, their structure, authentication flow, and common use cases.",
  },

  {
    keywords: ["oauth", "oauth2", "oauth 2.0"],
    title: "OAuth 2.0 Documentation",
    url: "https://oauth.net/2/",
    description:
      "Documentation covering OAuth 2.0 authorization flows, tokens, clients, scopes, and authentication concepts.",
  },


  // ===================================================
  // DEVOPS
  // ===================================================

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
      "Official Kubernetes documentation covering containers, pods, deployments, services, networking, and orchestration.",
  },

  {
    keywords: ["git", "github"],
    title: "Git Documentation",
    url: "https://git-scm.com/doc",
    description:
      "Official Git documentation covering version control, repositories, branches, commits, merging, and workflows.",
  },


  // ===================================================
  // CLOUD
  // ===================================================

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


  // ===================================================
  // CYBERSECURITY
  // ===================================================

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

  return text
    .toLowerCase()
    .replace(/[^\w\s.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

};


// =====================================================
// FIND DOCUMENTATION
// =====================================================

const findDocumentation = (resource = {}) => {

  const text = normalizeText(
    `${resource.title || ""} ${
      resource.searchQuery || ""
    } ${
      resource.description || ""
    }`
  );


  // -----------------------------------------------
  // Find matching documentation
  // -----------------------------------------------

  for (const documentation of documentationMap) {

    const matched =
      documentation.keywords.some(
        (keyword) => {

          const normalizedKeyword =
            normalizeText(keyword);

          return text.includes(
            normalizedKeyword
          );

        }
      );


    if (matched) {

      return documentation;

    }

  }


  return null;

};


// =====================================================
// SEARCH DOCUMENTATION
// =====================================================
// Kept as "searchGoogle" for backward compatibility.
// It does NOT call Google Custom Search API.
// =====================================================

const searchGoogle = async (query) => {

  console.log(
    "Official documentation lookup:",
    query
  );


  const result =
    findDocumentation({
      title: query,
      searchQuery: query,
    });


  if (!result) {

    console.log(
      "No official documentation mapping found:",
      query
    );

    return null;

  }


  console.log(
    "Documentation found:",
    result.title,
    result.url
  );


  return {

    title:
      result.title,

    url:
      result.url,

    description:
      result.description,

    displayLink:
      result.url,

  };

};


// =====================================================
// DOCUMENTATION ENRICHMENT
// =====================================================

const searchDocumentation = async (
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


    // ===============================================
    // VIDEO RESOURCE
    // ===============================================

    if (
      resource.type === "video"
    ) {

      updatedResources.push(
        resource
      );

      continue;

    }


    // ===============================================
    // DOCUMENTATION RESOURCE
    // ===============================================

    if (
      resource.type === "documentation" ||
      resource.type === "docs"
    ) {

      const documentation =
        findDocumentation(
          resource
        );


      // ---------------------------------------------
      // Documentation found
      // ---------------------------------------------

      if (documentation) {

        updatedResources.push({

          ...resource,

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

        });

      }


      // ---------------------------------------------
      // Documentation NOT found
      // ---------------------------------------------

      else {

        // Don't create fake URLs.

        updatedResources.push({

          ...resource,

          url:
            resource.url || "",

          displayLink:
            resource.url || "",

          source:
            resource.url
              ? "provided-url"
              : null,

        });

      }


      continue;

    }


    // ===============================================
    // OTHER RESOURCE TYPES
    // ===============================================

    updatedResources.push(
      resource
    );

  }


  return updatedResources;

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  searchGoogle,

  searchDocumentation,

};