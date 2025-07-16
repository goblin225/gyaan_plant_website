import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getleaderboard } from "../services/service";
import { Trophy, Medal, Award, Crown, Star, User, Lock } from "lucide-react";

import proBadge from "../assets/images/7.png";
import warriorBadge from "../assets/images/5.png";
import winnerBadge from "../assets/images/6.png";
import starterBadge from "../assets/images/6.png";

const LeaderPage = () => {
  const { data: leader, isLoading } = useQuery({
    queryKey: ["getleaderboard"],
    queryFn: getleaderboard,
  });

  const leaderData = leader?.data || [];

  let userId = null;
  const local = sessionStorage.getItem("user");
  if (local) {
    const user = JSON.parse(local);
    userId = user?.id;
  }


  
  

  const currentUserLeaderboard = leaderData.find(
    (item:any) => item.userId === userId
  );

  const sortedLeaderboard = [...leaderData].sort((a, b) => {
    return (a.rank || 0) - (b.rank || 0);
  });

  const getLastBadgeColor = (badges = []) => {
    for (let i = badges.length - 1; i >= 0; i--) {
      if (badges[i].unlocked) {
        switch (badges[i].type) {
          case "starter":
            return "bg-teal-100";
          case "pro":
            return "bg-yellow-100";
          case "warrior":
            return "bg-red-100";
          case "winner":
            return "bg-purple-100";
          default:
            return "bg-gray-100";
        }
      }
    }
    return "bg-gray-100";
  };

  const getRankIcon = (rank:any) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <Trophy className="w-5 h-5 text-blue-500" />;
    }
  };

  const renderBadge = (badge:any) => {
    const badgeImages = {
      starter: starterBadge,
      pro: proBadge,
      warrior: warriorBadge,
      winner: winnerBadge,
    };

    return (
      <div key={badge.type} className="flex flex-col items-center p-2">
        <div className="relative">
          <img
            src={badgeImages[badge.type]}
            alt={badge.type}
            className="w-16 h-16 object-contain"
          />
          {!badge.unlocked && (
            <>
              <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-lg"></div>
              <Lock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
            </>
          )}
        </div>
        <span className="text-xs mt-1 font-medium">
          {badge.type.toUpperCase()}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4 dark:bg-gray-950">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <User className="w-6 h-6 mr-2" /> Your Rank
            </h2>

            {currentUserLeaderboard ? (
              <div className="space-y-4 ">
                <div
                  className={`rounded-lg p-4 ${getLastBadgeColor(
                    currentUserLeaderboard.badges
                  )}`}
                >
                  <div className="flex items-center justify-between mb-3 dark:text-gray-900 ">
                    <div className="flex items-center">
                      {getRankIcon(currentUserLeaderboard.rank)}
                      <span className="ml-2 text-2xl font-bold dark:text-gray-900 ">
                        #{currentUserLeaderboard.rank}
                      </span>
                    </div>
                  </div>
                  <p className="text-lg font-semibold dark:text-gray-900 ">
                    {currentUserLeaderboard.name || "You"}
                  </p>
                  <p className="text-sm opacity-80 dark:text-gray-900 ">
                    Level {currentUserLeaderboard.level}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 ">
                  <div className="bg-gray-100 rounded-lg p-3 text-center dark:bg-gray-950">
                    <p className="text-2xl font-bold text-blue-600">
                      {currentUserLeaderboard.completedCourses}
                    </p>
                    <p className="text-sm">Course Completed</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 text-center dark:bg-gray-950">
                    <p className="text-2xl font-bold text-green-600">
                      {currentUserLeaderboard.points}
                    </p>
                    <p className="text-sm">Points</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-4">Your Badges</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {currentUserLeaderboard.badges.map(renderBadge)}
                  </div>
                </div>
              </div>
            ) : (
              <p>No rank data available</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg dark:bg-gray-950">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold flex items-center">
                <Trophy className="w-6 h-6 mr-2" /> Global Rankings
              </h2>
            </div>

            <div className="p-6">
              {sortedLeaderboard.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center p-4 rounded-lg"
                >
                  <div className="flex items-center w-16">
                    {getRankIcon(user.rank)}
                    <span className="ml-2 text-lg font-bold">#{user.rank}</span>
                  </div>

                  <div className="flex-1 ml-4 flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">
                        {user.name}
                        {user.userId === userId && (
                          <span className="ml-2 text-sm bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">Level {user.level}</p>
                    </div>
                    <div className="flex items-center text-lg font-bold">
                      <Star className="w-5 h-5 text-yellow-500 mr-1" />
                      {user.points}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderPage;