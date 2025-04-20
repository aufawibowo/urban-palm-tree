# Basic Questions

> Imagine you're building a website that allows users to submit photos. One of the requirements is that each photo must be reviewed by a moderator before it can be published. How would you design the logic for this process? What technologies would you use? Do you have any data structure in mind to support this based on your technology of choice to handle those data?

1. High-Level Workflow
   1. User submits a photo
      1. Stored in object storage (e.g., S3)
      2. Metadata saved in DB with status = `pending`, with max retention of 5 hours before delete (saving on storage)
      3. CRON/background job are run for every 3 hours, if there are data that is exist above 5 hours (from `created_at`) then delete
   2. Moderators review photos
      1. View photos via dashboard
      2. Accept or reject them
   3. Photo becomes visible
      1. If accepted → photo is shown on public site
      2. If rejected → remains hidden (optional user notification)
2. Tech Stack (Pragmatic & Scalable)

Purpose | Tech Stack Example | Notes
-|-|-
Backend | Go / Node.js / Ruby on Rails | REST or GraphQL API
Frontend | React / Next.js | Moderator dashboard and user site
Database | PostgreSQL | Strong relational modeling for status, users, audit logs
Object Storage | Amazon S3 / GCS / MinIO | Store actual photos securely
Queue (optional) | RabbitMQ / Sidekiq / SQS | Async processing (e.g., image processing, ML checks)
CDN | Cloudflare / CloudFront | Speed up photo delivery
Auth | Auth0 / Firebase Auth / Devise (Rails) | Secure access control
Background Jobs | Sidekiq (Rails) / BullMQ (Node.js) | For moderation pipeline, audit trail

3. Data Model

```
users (
  id, name, email, role (user/moderator), created_at
)

photos (
  id, user_id, url, status (pending, approved, rejected), rejection_reason, created_at, reviewed_at
)

moderation_logs (
  id, photo_id, moderator_id, action (approve/reject), notes, created_at
)
```

- `photos.status` handles workflow control
- `moderation_logs` ensures auditability
- Add soft deletes if needed

4. Additional Considerations
   1. Validation & Filters
      1. Client-side: file size, format
      2. Backend: virus scanning, EXIF stripping
      3. Optional: ML model for NSFW detection (flag before human review)
   2. Asynchronous Processing
      1. Photo upload triggers job → resize, thumbnail, ML tagging
      2. Result stays in pending until manual approval
   3. Moderator Experience
      1. Queue-based moderation UI
      2. Filter/sort by upload date, flagged photos, etc.
      3. Optional “bulk review” if scaling
   4. Metrics & Monitoring
      1. Number of pending photos
      2. Time to moderation
      3. Moderator performance
5. Trade-Offs & Scale Planning
   
   Start simple: direct DB checks, manual review.
   Later at scale: ML pre-filter before human review, Partition moderation queues by category or priority, Use Kafka/SQS for decoupling moderation & publishing

# Database Questions

Level 1:
```sql
SELECT * FROM customers WHERE customers.country = 'Germany';
```

Level 2:
```sql
SELECT Country, COUNT(*) AS total_customers
FROM Customers
GROUP BY Country
HAVING COUNT(*) >= 5
ORDER BY total_customers DESC;
```

Level 3:
```sql
SELECT 
    Customers.CustomerName,
    COUNT(Orders.OrderID) AS OrderCount,
    MIN(Orders.OrderDate) AS FirstOrder,
    MAX(Orders.OrderDate) AS LastOrder
FROM Customers
JOIN Orders ON Customers.CustomerID = Orders.CustomerID
GROUP BY Customers.CustomerName
HAVING COUNT(Orders.OrderID) >= 5
ORDER BY OrderCount DESC;
```

# Javascript Question

Level 1
```javascript
function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

Level 2
```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

delay(3000).then(() => alert('runs after 3 seconds'));
```

Level 2.5
```javascript
function fetchData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!url) {
        reject("URL is required");
      } else {
        resolve(`Data from ${url}`);
      }
    }, 1000);
  });
}

function processData(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!data) {
        reject("Data is required");
      } else {
        resolve(data.toUpperCase());
      }
    }, 1000);
  });
}

async function main() {
  try {
    const data = await fetchData("https://example.com");
    const processedData = await processData(data);
    console.log("Processed Data:", processedData);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();

```

# Realtime chat

http://128.199.121.185:3000 or check out the code in `/client` and `/server` folder

# VueJS

1. Explain Vue.js reactivity and common issues when tracking changes.
Vue tracks reactive data via getters/setters (Vue 2) or Proxies (Vue 3).
Common issues:
   - Adding new reactive properties without Vue.set() (Vue 2)
   - Mutating nested objects/arrays directly
   - Not using ref() or reactive() properly in Vue 3
2. Describe data flow between components in a Vue.js app
   - Parent → Child: via props
   - Child → Parent: via $emit
   - Siblings / Global: via event bus (Vue 2), or state management (e.g. Vuex, Pinia)
3. List the most common cause of memory leaks in Vue.js apps and how they can be solved.
   - Unremoved event listeners (e.g., window.addEventListener)
   - Long-lived timers (setInterval) not cleared
   - Components not properly destroyed
   Solution:
   - Use beforeUnmount/beforeDestroy hooks to clean up
   - Use tools like Vue Devtools or Chrome profiler for detection

4. What have you used for state management
   - Vuex: robust, great for large apps
   - Pinia: simpler API, modular, Vue 3 recommended
5. What’s the difference between pre-rendering and server side rendering?
   - Pre-rendering: HTML is generated at build time, static, fast (e.g., nuxt generate)
   - SSR (Server-Side Rendering): HTML is generated at request time, dynamic (e.g., nuxtServerInit)
   - Tradeoff: Pre-render = speed, SSR = flexibility/dynamic content
