const Request = require("../models/Request");
const NotificationService = require("./notification");

const Scheduler = {
  // Check availability for a given service and time slot
  checkAvailability: async (serviceId, dateTime) => {
    // Placeholder for checking the availability of the service provider
    // This would typically involve checking the service provider's schedule
    // Return true if available, false otherwise
    return true; // Replace with actual logic
  },

  // Schedule a service request
  scheduleRequest: async (userId, serviceId, dateTime, details) => {
    // Validate date and time, ensure it's not in the past
    const now = new Date();
    if (new Date(dateTime) < now) {
      throw new Error("Cannot schedule in the past");
    }

    // Check if the time slot is available
    const isAvailable = await Scheduler.checkAvailability(serviceId, dateTime);
    if (!isAvailable) {
      throw new Error("Time slot is not available");
    }

    // Create a new service request
    const newRequest = new Request({
      user: userId,
      service: serviceId,
      details: details,
      dateRequested: dateTime,
      status: "pending",
    });

    const savedRequest = await newRequest.save();

    // Send notification about the scheduled request
    NotificationService.sendNotification(
      userId,
      `Your service request for ${serviceId} is scheduled for ${dateTime}.`,
      "email"
    );

    return savedRequest;
  },
  // Reschedule a service request
  rescheduleRequest: async (requestId, newDateTime) => {
    // Find the request
    const request = await Request.findById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    // Check if the new time slot is available
    const isAvailable = await Scheduler.checkAvailability(
      request.service,
      newDateTime
    );
    if (!isAvailable) {
      throw new Error("Time slot is not available");
    }

    // Update the request with the new date
    request.dateRequested = newDateTime;
    const updatedRequest = await request.save();

    // Send notification about the rescheduled request
    NotificationService.sendNotification(
      updatedRequest.user,
      `Your service request for ${updatedRequest.service} has been rescheduled to ${newDateTime}.`,
      "email"
    );

    return updatedRequest;
  },

  // Cancel a service request
  cancelRequest: async (requestId) => {
    // Find the request
    const request = await Request.findById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    // Update the request status to cancelled
    request.status = "cancelled";
    // Send notification about the cancellation
    NotificationService.sendNotification(
      updatedRequest.user,
      `Your service request for ${updatedRequest.service} has been cancelled.`,
      "email"
    );

    return updatedRequest;
  },

  // Placeholder for Notification Function
  sendNotification: (userId, message) => {
    // TODO: Implement notification logic once notification utility is ready
    console.log(`Notification to user ${userId}: ${message}`);
  },
};

module.exports = Scheduler;
