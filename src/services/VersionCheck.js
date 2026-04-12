import Constants from 'expo-constants';
import axios from 'axios';

// Placeholder URL - User should replace this with their actual raw GitHub URL
const VERSION_JSON_URL = 'https://raw.githubusercontent.com/sefo15tarek/NanoAI-v1/main/version.json';

export const checkVersion = async () => {
  try {
    const currentVersion = Constants.expoConfig.version || '1.0.0';
    
    // Fetch version data from GitHub
    const response = await axios.get(VERSION_JSON_URL);
    const remoteData = response.data;

    const { latestVersion, minVersion, isForceUpdate, releaseNotes, updateUrl } = remoteData;

    // Semantic version comparison
    const isUpdateAvailable = compareVersions(currentVersion, latestVersion) < 0;
    const isMandatory = isForceUpdate || compareVersions(currentVersion, minVersion) < 0;

    return {
      isUpdateAvailable,
      isMandatory,
      latestVersion,
      releaseNotes,
      updateUrl
    };
  } catch (error) {
    console.error('Error fetching version info:', error);
    return { isUpdateAvailable: false };
  }
};

/**
 * Simple semantic version comparer
 * Returns: -1 if v1 < v2, 1 if v1 > v2, 0 if v1 == v2
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }
  return 0;
}
