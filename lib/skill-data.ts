import {
  SiPython, SiPandas, SiNumpy, SiPostgresql, SiJavascript, SiLua, SiDart, SiNodedotjs, SiReact,
  SiApachespark, SiApachehadoop,
  SiHtml5, SiCss, SiNextdotjs, SiTailwindcss, SiTypescript,
  SiGithub, SiBlender,
} from 'react-icons/si';
import type { IconType } from 'react-icons';
import { Presentation, ChartPie, FileSpreadsheet, Monitor } from 'lucide-react';

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon?: IconType;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

const rawSkills: Omit<SkillItem, 'id'>[] = [
  // Programming & Query Languages
  { name: 'Python', category: 'Programming', description: 'Proficient in Python for data analysis, scripting, automation, and machine learning workflows.', icon: SiPython, level: 'Advanced' },
  { name: 'Pandas', category: 'Programming', description: 'Expert in data manipulation, transformation, and analysis using Pandas DataFrames.', icon: SiPandas, level: 'Advanced' },
  { name: 'NumPy', category: 'Programming', description: 'Skilled in numerical computing, array operations, and linear algebra with NumPy.', icon: SiNumpy, level: 'Advanced' },
  { name: 'SQL', category: 'Programming', description: 'Experienced in writing complex queries, joins, window functions, and database optimization.', icon: SiPostgresql, level: 'Advanced' },
  { name: 'JavaScript', category: 'Programming', description: 'Capable in front-end and back-end JavaScript development for web applications.', icon: SiJavascript, level: 'Intermediate' },
  { name: 'Lua', category: 'Programming', description: 'Familiar with Lua scripting for embedded systems and game development contexts.', icon: SiLua, level: 'Beginner' },
  { name: 'Dart', category: 'Programming', description: 'Building cross-platform mobile applications using Dart and Flutter.', icon: SiDart, level: 'Beginner' },
  { name: 'Node.js', category: 'Programming', description: 'Building server-side applications, REST APIs, and real-time services with Node.js.', icon: SiNodedotjs, level: 'Intermediate' },
  { name: 'React', category: 'Programming', description: 'Developing dynamic single-page applications and component-based UIs with React.', icon: SiReact, level: 'Intermediate' },

  // Data & Analytics
  { name: 'Data Analysis', category: 'Analytics', description: 'Extracting insights from complex datasets using statistical methods and analytical tools.', level: 'Advanced' },
  { name: 'Exploratory Data Analysis', category: 'Analytics', description: 'Systematically exploring datasets to discover patterns, anomalies, and relationships.', level: 'Advanced' },
  { name: 'Data Cleaning', category: 'Analytics', description: 'Transforming raw data into quality datasets by handling missing values, outliers, and inconsistencies.', level: 'Advanced' },
  { name: 'Data Mining', category: 'Analytics', description: 'Discovering patterns and extracting knowledge from large datasets using computational techniques.', level: 'Intermediate' },
  { name: 'Data Warehousing', category: 'Analytics', description: 'Designing and managing centralized repositories for efficient data storage and retrieval.', level: 'Intermediate' },
  { name: 'Business Intelligence', category: 'Analytics', description: 'Translating data into actionable business insights through dashboards and reporting.', level: 'Intermediate' },
  { name: 'Statistical Analysis', category: 'Analytics', description: 'Applying statistical methods to test hypotheses and quantify relationships in data.', level: 'Advanced' },
  { name: 'Probability', category: 'Analytics', description: 'Applying probability theory for risk assessment, Bayesian inference, and stochastic modeling.', level: 'Intermediate' },
  { name: 'Predictive Modelling', category: 'Analytics', description: 'Building models that forecast future outcomes based on historical data patterns.', level: 'Intermediate' },

  // Machine Learning & AI
  { name: 'Basic Machine Learning', category: 'ML & AI', description: 'Foundational knowledge of ML algorithms, training pipelines, and model evaluation.', level: 'Advanced' },
  { name: 'Classification Modelling', category: 'ML & AI', description: 'Building classifiers using logistic regression, decision trees, SVMs, and ensemble methods.', level: 'Intermediate' },
  { name: 'Clustering', category: 'ML & AI', description: 'Applying unsupervised learning techniques like K-Means and DBSCAN for pattern discovery.', level: 'Intermediate' },
  { name: 'Association Analysis', category: 'ML & AI', description: 'Discovering relationships between variables using Apriori and FP-Growth algorithms.', level: 'Intermediate' },
  { name: 'Linear Regression', category: 'ML & AI', description: 'Implementing and interpreting linear regression models for prediction and inference.', level: 'Advanced' },
  { name: 'Deep Learning', category: 'ML & AI', description: 'Building and training neural networks for complex pattern recognition tasks.', level: 'Intermediate' },
  { name: 'Image Recognition', category: 'ML & AI', description: 'Applying CNNs and transfer learning for computer vision and image classification tasks.', level: 'Intermediate' },
  { name: 'Explainable AI', category: 'ML & AI', description: 'Making AI model decisions interpretable and transparent using SHAP, LIME, and similar methods.', level: 'Intermediate' },
  { name: 'Generative AI Analytics', category: 'ML & AI', description: 'Leveraging generative models for data augmentation, synthesis, and analytical workflows.', level: 'Intermediate' },

  // Visualization & BI Tools
  { name: 'Power BI', category: 'Visualization', description: 'Creating interactive dashboards, DAX calculations, and enterprise BI solutions.', icon: Presentation, level: 'Advanced' },
  { name: 'Tableau', category: 'Visualization', description: 'Building visual analytics and storytelling dashboards.', icon: ChartPie, level: 'Intermediate' },
  { name: 'Data Visualization', category: 'Visualization', description: 'Designing clear, compelling charts and visual narratives from complex datasets.', level: 'Advanced' },
  { name: 'Excel PivotTables', category: 'Visualization', description: 'Summarizing and analyzing large datasets dynamically with PivotTables.', icon: FileSpreadsheet, level: 'Advanced' },
  { name: 'Excel PivotCharts', category: 'Visualization', description: 'Creating dynamic, linked charts from PivotTable data for reporting.', icon: FileSpreadsheet, level: 'Advanced' },
  { name: 'Excel Modelling', category: 'Visualization', description: 'Building financial and operational models with advanced Excel formulas.', icon: FileSpreadsheet, level: 'Advanced' },
  { name: 'Excel Macros', category: 'Visualization', description: 'Automating repetitive tasks and workflows using recorded macros.', icon: FileSpreadsheet, level: 'Intermediate' },
  { name: 'VBA', category: 'Visualization', description: 'Writing custom macros and automation scripts using Visual Basic for Applications.', level: 'Intermediate' },

  // Big Data & Cloud
  { name: 'Cloud Data Analytics', category: 'Big Data', description: 'Running analytical workloads on cloud platforms with scalable infrastructure.', level: 'Intermediate' },
  { name: 'Hadoop', category: 'Big Data', description: 'Distributed storage and processing of large datasets using the Hadoop ecosystem.', icon: SiApachehadoop, level: 'Beginner' },
  { name: 'Apache Spark', category: 'Big Data', description: 'High-performance distributed data processing and streaming.', icon: SiApachespark, level: 'Beginner' },
  { name: 'Big Data Foundations', category: 'Big Data', description: 'Understanding of big data architecture, the V\'s of big data, and ecosystem components.', level: 'Intermediate' },

  // Web Development
  { name: 'HTML', category: 'Web Dev', description: 'Semantic markup and accessible page structure for modern web applications.', icon: SiHtml5, level: 'Advanced' },
  { name: 'CSS', category: 'Web Dev', description: 'Responsive layouts, animations, and design systems with modern CSS.', icon: SiCss, level: 'Intermediate' },
  { name: 'Next.js', category: 'Web Dev', description: 'Full-stack React framework for SSR, SSG, and API routes.', icon: SiNextdotjs, level: 'Intermediate' },
  { name: 'Tailwind CSS', category: 'Web Dev', description: 'Utility-first CSS framework for rapid, consistent UI development.', icon: SiTailwindcss, level: 'Intermediate' },
  { name: 'TypeScript', category: 'Web Dev', description: 'Type-safe JavaScript development for scalable and maintainable codebases.', icon: SiTypescript, level: 'Intermediate' },
  { name: 'Frontend Development', category: 'Web Dev', description: 'Building responsive, interactive user interfaces with modern frameworks and tools.', level: 'Intermediate' },
  { name: 'Full Stack Development', category: 'Web Dev', description: 'End-to-end application development spanning frontend, backend, and database layers.', level: 'Intermediate' },

  // Databases
  { name: 'Database Foundations', category: 'Databases', description: 'Core understanding of relational database design, normalization, and querying.', level: 'Intermediate' },
  { name: 'Programming Foundations: Databases', category: 'Databases', description: 'Fundamental database programming concepts including SQL, stored procedures, and transactions.', level: 'Intermediate' },

  // Security & Networking
  { name: 'Computer Networking', category: 'Security', description: 'Understanding of network protocols, OSI model, routing, and infrastructure.', level: 'Intermediate' },
  { name: 'Web Security', category: 'Security', description: 'Implementing secure web practices, OWASP mitigations, and authentication patterns.', level: 'Intermediate' },
  { name: 'Cybersecurity', category: 'Security', description: 'Knowledge of threat landscapes, defense-in-depth strategies, and security operations.', level: 'Intermediate' },
  { name: 'Penetration Testing', category: 'Security', description: 'Ethical hacking and vulnerability assessment to identify security weaknesses.', level: 'Beginner' },

  // Other Tools & Platforms
  { name: 'GitHub', category: 'Tools', description: 'Version control, collaborative development, CI/CD workflows, and repository management.', icon: SiGithub, level: 'Advanced' },
  { name: 'Blender 3D', category: 'Tools', description: '3D modeling, animation, and rendering for visual projects.', icon: SiBlender, level: 'Beginner' },
  { name: 'Microsoft Excel', category: 'Tools', description: 'Advanced spreadsheet operations, formulas, data analysis, and automation.', icon: FileSpreadsheet, level: 'Advanced' },
  { name: 'Visual Studio', category: 'Tools', description: 'IDE usage for development, debugging, and project management.', icon: Monitor, level: 'Intermediate' },
];

// Build flat skill list with stable IDs
const skills: SkillItem[] = rawSkills.map((s, i) => ({
  ...s,
  id: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i,
}));

export default skills;

// Unique category names for filtering
export const skillCategories = Array.from(new Set(skills.map((s) => s.category)));
