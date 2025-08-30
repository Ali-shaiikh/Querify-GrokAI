// Client-side SQL Query Generator
// This utility generates SQL queries based on CSV data and user questions

const generateSQLQuery = (question, csvData) => {
  if (!csvData || csvData.length === 0) {
    return {
      sql: 'SELECT * FROM data;',
      explanation: 'No data available to generate query.'
    };
  }

  const columns = Object.keys(csvData[0]);
  const sampleData = csvData.slice(0, 5);
  
  // Convert question to lowercase for easier matching
  const questionLower = question.toLowerCase();
  
  // Simple pattern matching to generate appropriate SQL queries
  if (questionLower.includes('count') || questionLower.includes('total number')) {
    return {
      sql: `SELECT COUNT(*) as total_count FROM data;`,
      explanation: 'This query counts the total number of records in your dataset.'
    };
  }
  
  if (questionLower.includes('average') || questionLower.includes('mean')) {
    const numericColumns = columns.filter(col => 
      typeof sampleData[0][col] === 'number'
    );
    
    if (numericColumns.length > 0) {
      const avgColumns = numericColumns.map(col => `AVG(${col}) as avg_${col}`).join(', ');
      return {
        sql: `SELECT ${avgColumns} FROM data;`,
        explanation: `This query calculates the average values for all numeric columns: ${numericColumns.join(', ')}.`
      };
    } else {
      return {
        sql: 'SELECT * FROM data LIMIT 10;',
        explanation: 'No numeric columns found for average calculation. Showing first 10 records instead.'
      };
    }
  }
  
  if (questionLower.includes('sum') || questionLower.includes('total')) {
    const numericColumns = columns.filter(col => 
      typeof sampleData[0][col] === 'number'
    );
    
    if (numericColumns.length > 0) {
      const sumColumns = numericColumns.map(col => `SUM(${col}) as total_${col}`).join(', ');
      return {
        sql: `SELECT ${sumColumns} FROM data;`,
        explanation: `This query calculates the sum of all numeric columns: ${numericColumns.join(', ')}.`
      };
    } else {
      return {
        sql: 'SELECT * FROM data LIMIT 10;',
        explanation: 'No numeric columns found for sum calculation. Showing first 10 records instead.'
      };
    }
  }
  
  if (questionLower.includes('top') || questionLower.includes('highest')) {
    const numericColumns = columns.filter(col => 
      typeof sampleData[0][col] === 'number'
    );
    
    if (numericColumns.length > 0) {
      const orderColumn = numericColumns[0];
      return {
        sql: `SELECT * FROM data ORDER BY ${orderColumn} DESC LIMIT 10;`,
        explanation: `This query shows the top 10 records ordered by ${orderColumn} in descending order.`
      };
    } else {
      return {
        sql: 'SELECT * FROM data LIMIT 10;',
        explanation: 'No numeric columns found for ordering. Showing first 10 records instead.'
      };
    }
  }
  
  if (questionLower.includes('bottom') || questionLower.includes('lowest')) {
    const numericColumns = columns.filter(col => 
      typeof sampleData[0][col] === 'number'
    );
    
    if (numericColumns.length > 0) {
      const orderColumn = numericColumns[0];
      return {
        sql: `SELECT * FROM data ORDER BY ${orderColumn} ASC LIMIT 10;`,
        explanation: `This query shows the bottom 10 records ordered by ${orderColumn} in ascending order.`
      };
    } else {
      return {
        sql: 'SELECT * FROM data LIMIT 10;',
        explanation: 'No numeric columns found for ordering. Showing first 10 records instead.'
      };
    }
  }
  
  if (questionLower.includes('group') || questionLower.includes('by')) {
    // Try to find a categorical column for grouping
    const categoricalColumns = columns.filter(col => 
      typeof sampleData[0][col] === 'string' && sampleData[0][col].length < 50
    );
    
    if (categoricalColumns.length > 0) {
      const groupColumn = categoricalColumns[0];
      const numericColumns = columns.filter(col => 
        typeof sampleData[0][col] === 'number'
      );
      
      if (numericColumns.length > 0) {
        const countColumn = numericColumns[0];
        return {
          sql: `SELECT ${groupColumn}, COUNT(*) as count, AVG(${countColumn}) as avg_${countColumn} FROM data GROUP BY ${groupColumn} ORDER BY count DESC;`,
          explanation: `This query groups the data by ${groupColumn} and shows the count and average of ${countColumn} for each group.`
        };
      } else {
        return {
          sql: `SELECT ${groupColumn}, COUNT(*) as count FROM data GROUP BY ${groupColumn} ORDER BY count DESC;`,
          explanation: `This query groups the data by ${groupColumn} and shows the count for each group.`
        };
      }
    } else {
      return {
        sql: 'SELECT * FROM data LIMIT 10;',
        explanation: 'No suitable categorical columns found for grouping. Showing first 10 records instead.'
      };
    }
  }
  
  if (questionLower.includes('filter') || questionLower.includes('where') || questionLower.includes('greater than') || questionLower.includes('less than')) {
    const numericColumns = columns.filter(col => 
      typeof sampleData[0][col] === 'number'
    );
    
    if (numericColumns.length > 0) {
      const filterColumn = numericColumns[0];
      const sampleValue = Math.round(sampleData[0][filterColumn] * 0.8); // Use 80% of a sample value
      
      if (questionLower.includes('greater than')) {
        return {
          sql: `SELECT * FROM data WHERE ${filterColumn} > ${sampleValue};`,
          explanation: `This query filters records where ${filterColumn} is greater than ${sampleValue}.`
        };
      } else if (questionLower.includes('less than')) {
        return {
          sql: `SELECT * FROM data WHERE ${filterColumn} < ${sampleValue};`,
          explanation: `This query filters records where ${filterColumn} is less than ${sampleValue}.`
        };
      } else {
        return {
          sql: `SELECT * FROM data WHERE ${filterColumn} > ${sampleValue} LIMIT 20;`,
          explanation: `This query filters records where ${filterColumn} is greater than ${sampleValue}.`
        };
      }
    } else {
      return {
        sql: 'SELECT * FROM data LIMIT 10;',
        explanation: 'No numeric columns found for filtering. Showing first 10 records instead.'
      };
    }
  }
  
  if (questionLower.includes('duplicate') || questionLower.includes('duplicates')) {
    return {
      sql: `SELECT *, COUNT(*) as duplicate_count FROM data GROUP BY ${columns.join(', ')} HAVING COUNT(*) > 1;`,
      explanation: 'This query finds duplicate records by grouping on all columns and showing records that appear more than once.'
    };
  }
  
  if (questionLower.includes('unique') || questionLower.includes('distinct')) {
    return {
      sql: `SELECT DISTINCT * FROM data;`,
      explanation: 'This query returns only unique records from your dataset.'
    };
  }
  
  // Default query for any other question
  return {
    sql: `SELECT * FROM data LIMIT 20;`,
    explanation: 'This query shows the first 20 records from your dataset. You can modify it based on your specific needs.'
  };
};

const getSQLHelp = (question) => {
  const questionLower = question.toLowerCase();
  
  if (questionLower.includes('join')) {
    return {
      answer: `SQL JOINs combine rows from two or more tables based on a related column between them.

Types of JOINs:
- INNER JOIN: Returns records that have matching values in both tables
- LEFT JOIN: Returns all records from the left table and matching records from the right table
- RIGHT JOIN: Returns all records from the right table and matching records from the left table
- FULL JOIN: Returns all records when there is a match in either left or right table

Example:
SELECT a.name, b.order_id 
FROM customers a 
INNER JOIN orders b ON a.customer_id = b.customer_id;`,
      explanation: 'SQL JOIN explanation and examples'
    };
  }
  
  if (questionLower.includes('where') || questionLower.includes('filter')) {
    return {
      answer: `The WHERE clause filters records based on specified conditions.

Operators:
- = (equal)
- != or <> (not equal)
- > (greater than)
- < (less than)
- >= (greater than or equal)
- <= (less than or equal)
- LIKE (pattern matching)
- IN (multiple values)
- BETWEEN (range)

Examples:
SELECT * FROM customers WHERE age > 25;
SELECT * FROM products WHERE price BETWEEN 10 AND 100;
SELECT * FROM users WHERE name LIKE 'John%';`,
      explanation: 'SQL WHERE clause usage and examples'
    };
  }
  
  if (questionLower.includes('group') || questionLower.includes('aggregate')) {
    return {
      answer: `GROUP BY groups rows that have the same values in specified columns.

Common aggregate functions:
- COUNT(): Counts rows
- SUM(): Sums values
- AVG(): Calculates average
- MAX(): Finds maximum value
- MIN(): Finds minimum value

Example:
SELECT department, COUNT(*) as employee_count, AVG(salary) as avg_salary
FROM employees 
GROUP BY department;`,
      explanation: 'SQL GROUP BY and aggregate functions explanation'
    };
  }
  
  if (questionLower.includes('order') || questionLower.includes('sort')) {
    return {
      answer: `ORDER BY sorts the result set in ascending or descending order.

Syntax:
SELECT column1, column2 FROM table_name ORDER BY column1 ASC|DESC;

Examples:
SELECT * FROM products ORDER BY price DESC;  -- Highest to lowest
SELECT * FROM customers ORDER BY name ASC;   -- A to Z
SELECT * FROM orders ORDER BY date DESC, amount ASC;  -- Multiple columns`,
      explanation: 'SQL ORDER BY clause usage and examples'
    };
  }
  
  // Default help response
  return {
    answer: `SQL (Structured Query Language) is used to manage and manipulate relational databases.

Common SQL commands:
- SELECT: Retrieve data
- INSERT: Add new records
- UPDATE: Modify existing records
- DELETE: Remove records
- CREATE: Create new tables/databases
- ALTER: Modify table structure
- DROP: Delete tables/databases

Basic SELECT syntax:
SELECT column1, column2 FROM table_name WHERE condition ORDER BY column1;`,
    explanation: 'General SQL introduction and basic commands'
  };
};

export { generateSQLQuery, getSQLHelp };
