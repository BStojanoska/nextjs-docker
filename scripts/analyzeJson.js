const fs = require('fs').promises;
const path = require('path');

async function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  try {
    await fs.mkdir(dirname, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
}

async function writeArrayToFile(dataArray, fileName) {
  try {
    await ensureDirectoryExists(fileName);

    // Check if dataArray is an array
    if (!Array.isArray(dataArray)) {
      dataArray = Array.from(dataArray);
    }

    // Remove empty strings from the array
    dataArray = dataArray.filter((item) => item !== '');

    // Convert Array to CSV string (each value on a new line)
    const csvString = dataArray.join('\n') + '\n'; // Add '\n' to end for correct EOF
    await fs.writeFile(fileName, csvString, 'utf8');
    console.log(`Successfully wrote to ${fileName}`);
  } catch (error) {
    console.error(`Error writing to file ${fileName}:`, error);
  }
}

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const jsonObjects = JSON.parse(data);

    // Use structures to track unique values and nullability
    const uniqueValues = {
      'Assigned Topics': new Set(),
      'Assigned Sub Topics': new Set(),
      'Assigned Categories': new Set(),
      status: new Set(),
      organization: new Set()
    };
    const nullableChecks = {
      organization: false,
      'Assigned Topics': false,
      'Assigned Sub Topics': false,
      'Assigned Categories': false,
      'issued-year': false,
      'web-link': false,
      'download-link': false
    };

    // Initial values for range checks
    let rangeMin = Infinity;
    let rangeMax = -Infinity;

    // Check for multiple categories in a single entry
    let multipleCategories = false;

    jsonObjects.forEach(obj => {
      Object.keys(uniqueValues).forEach(key => {
        const value = obj[key];
        if (Array.isArray(value)) {
          value.forEach(item => uniqueValues[key].add(item));
          if (key === 'categories' && value.length > 1) multipleCategories = true;
        } else {
          uniqueValues[key].add(value);
        }
      });

      // Update range for 'Assigned Score'
      rangeMin = Math.min(rangeMin, obj['Assigned Score']);
      rangeMax = Math.max(rangeMax, obj['Assigned Score']);

      // Check nullables
      Object.keys(nullableChecks).forEach(key => {
        if (obj[key] === null && !nullableChecks[key]) {
          nullableChecks[key] = true;
        }
        // For array fields, check if empty for nullability
        if (Array.isArray(obj[key]) && obj[key].length === 0 && !nullableChecks[key]) {
          nullableChecks[key] = true;
        }
      });
    });

    // Writing the results
    const mergedTopics = new Set([...uniqueValues['Assigned Topics'], ...uniqueValues['Assigned Sub Topics']]);

    await writeArrayToFile(mergedTopics, './scripts/output/topics.txt');
    await writeArrayToFile(uniqueValues['Assigned Categories'], './scripts/output/categories.txt');
    await writeArrayToFile(uniqueValues['status'], './scripts/output/statuses.txt');
    await writeArrayToFile(uniqueValues['organization'], './scripts/output/organizations.txt');

    // Display results
    Object.entries(uniqueValues).forEach(([key, value]) => {
      console.log(`Unique ${key.charAt(0).toUpperCase() + key.slice(1)} (${uniqueValues[key].size} out of ${jsonObjects.length}):`, [...value]);
    });
    console.log('Range Min:', rangeMin);
    console.log('Range Max:', rangeMax);
    console.log('Multiple Categories:', multipleCategories);
    Object.entries(nullableChecks).forEach(([key, value]) => {
      console.log(`Nullable ${key.charAt(0).toUpperCase() + key.slice(1)}:`, value);
    });
  } catch (error) {
    console.error('Error reading or parsing the file:', error);
  }
}

// Replace 'data.json' with the path to your actual JSON file
readJsonFile('./scripts/data.json');
