/**
 * Service Repository - Data Layer
 * Single source of truth for all service data from respo.json
 */

import servicesData from './respo.json';

/**
 * Get all services
 * @returns {Array} Array of all service objects
 */
export const getAllServices = () => {
  return servicesData.services;
};

/**
 * Get all categories
 * @returns {Array} Array of category objects
 */
export const getAllCategories = () => {
  return servicesData.categories;
};

/**
 * Get a single service by ID
 * @param {string} id - The unique service ID
 * @returns {Object|undefined} Service object or undefined if not found
 */
export const getServiceById = (id) => {
  return servicesData.services.find(service => service.id === id);
};

/**
 * Get services filtered by category ID
 * @param {string} categoryId - Category ID to filter by
 * @returns {Array} Filtered array of service objects
 */
export const getServicesByCategoryId = (categoryId) => {
  if (!categoryId || categoryId === 'all') return servicesData.services;
  return servicesData.services.filter(service => 
    service.categoryId === categoryId
  );
};

/**
 * Get services filtered by city
 * @param {string} city - City name to filter by
 * @returns {Array} Filtered array of service objects
 */
export const getServicesByCity = (city) => {
  if (!city) return servicesData.services;
  return servicesData.services.filter(service => 
    service.city.toLowerCase().includes(city.toLowerCase())
  );
};

/**
 * Get unique cities from services
 * @returns {Array} Array of unique city strings
 */
export const getUniqueCities = () => {
  const cities = servicesData.services.map(s => s.city);
  return [...new Set(cities)].sort();
};

/**
 * Search services by query (searches in name, categoryId, and city)
 * @param {string} query - Search query string
 * @returns {Array} Filtered array of service objects matching the query
 */
export const searchServices = (query) => {
  if (!query) return servicesData.services;
  const queryLower = query.toLowerCase();
  return servicesData.services.filter(service => 
    service.name.toLowerCase().includes(queryLower) ||
    service.categoryId.toLowerCase().includes(queryLower) ||
    service.city.toLowerCase().includes(queryLower)
  );
};
