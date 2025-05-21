"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "next-auth";

interface UserAvatarProps {
  user: User | undefined;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Generate a consistent color based on the user's name or email
 * @param name The user's name or email
 * @returns A CSS color string
 */
const generateColorFromName = (name: string): string => {
  // List of pleasant background colors
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];
  
  // Generate a simple hash from the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use the hash to pick a color
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

/**
 * Get the user's initials from their name or email
 * @param user The user object
 * @returns The user's initials (1-2 characters)
 */
const getInitials = (user: User | undefined): string => {
  if (!user) return "?";
  
  // If we have a name, use the first letter of first and last name
  if (user.name) {
    const nameParts = user.name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    // If only one name, use the first letter
    return user.name[0].toUpperCase();
  }
  
  // Fallback to email
  if (user.email) {
    return user.email[0].toUpperCase();
  }
  
  return "?";
};

export default function UserAvatar({ user, className = "", size = "md" }: UserAvatarProps) {
  // Determine size classes
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-lg",
  };
  
  // Generate background color based on user's name or email
  const bgColor = user ? 
    generateColorFromName(user.name || user.email || "User") : 
    "bg-gray-400";
  
  // Get user's initials
  const initials = getInitials(user);
  
  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {user?.image ? (
        <AvatarImage 
          src={user.image} 
          alt={user.name || "User avatar"} 
          referrerPolicy="no-referrer" // Important for Google images
        />
      ) : null}
      <AvatarFallback className={`${bgColor} text-white font-medium`}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
