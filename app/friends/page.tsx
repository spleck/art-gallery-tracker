"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Friend {
  id: string;
  status: string;
  direction: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  friendshipStatus: string | null;
  friendshipId: string | null;
}

export default function FriendsPage() {
  const { data: session, status } = useSession();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchFriends();
    }
  }, [status]);

  const fetchFriends = async () => {
    try {
      const response = await fetch("/api/friends");
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      const response = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendId: userId })
      });

      if (response.ok) {
        searchUsers(); // Refresh search results
        fetchFriends(); // Refresh friends list
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    try {
      const response = await fetch(`/api/friends/${friendshipId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" })
      });

      if (response.ok) {
        fetchFriends();
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const rejectFriendRequest = async (friendshipId: string) => {
    try {
      const response = await fetch(`/api/friends/${friendshipId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" })
      });

      if (response.ok) {
        fetchFriends();
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const removeFriend = async (friendshipId: string) => {
    if (!confirm("Remove this friend?")) return;

    try {
      const response = await fetch(`/api/friends/${friendshipId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchFriends();
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  if (status === "loading" || loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Friends</h1>
        <p className="text-gray-600 mb-4">Please sign in to manage friends</p>
        <a href="/signin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Sign In
        </a>
      </div>
    );
  }

  const pendingReceived = friends.filter(f => f.status === "PENDING" && f.direction === "received");
  const pendingSent = friends.filter(f => f.status === "PENDING" && f.direction === "sent");
  const acceptedFriends = friends.filter(f => f.status === "ACCEPTED");

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Friends</h1>

      {/* Search for users */}
      <div className="bg-slate-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Find Friends</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchUsers()}
            placeholder="Search by name or email..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={searchUsers}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Search results */}
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium text-gray-600">Results</h3>
            {searchResults.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center gap-3">
                  {user.image && (
                    <img src={user.image} alt={user.name || ""} className="w-10 h-10 rounded-full" />
                  )}
                  <div>
                    <p className="font-medium">{user.name || user.email}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                {user.friendshipStatus === "ACCEPTED" ? (
                  <span className="text-green-600 text-sm">Friends</span>
                ) : user.friendshipStatus === "PENDING" ? (
                  <span className="text-yellow-600 text-sm">Pending</span>
                ) : (
                  <button
                    onClick={() => sendFriendRequest(user.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Add Friend
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending requests */}
      {pendingReceived.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
          <div className="space-y-2">
            {pendingReceived.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  {request.user.image && (
                    <img src={request.user.image} alt={request.user.name || ""} className="w-12 h-12 rounded-full" />
                  )}
                  <div>
                    <p className="font-medium">{request.user.name || request.user.email}</p>
                    <p className="text-sm text-gray-500">{request.user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptFriendRequest(request.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectFriendRequest(request.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending sent */}
      {pendingSent.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Sent Requests</h2>
          <div className="space-y-2">
            {pendingSent.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {request.user.image && (
                    <img src={request.user.image} alt={request.user.name || ""} className="w-12 h-12 rounded-full" />
                  )}
                  <div>
                    <p className="font-medium">{request.user.name || request.user.email}</p>
                    <p className="text-sm text-gray-500">{request.user.email}</p>
                  </div>
                </div>
                <span className="text-gray-500 text-sm">Waiting for response...</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends list */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Friends ({acceptedFriends.length})</h2>
        {acceptedFriends.length === 0 ? (
          <p className="text-gray-500">No friends yet. Search for people above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acceptedFriends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <a href={`/friends/${friend.user.id}`} className="flex items-center gap-3 flex-1">
                  {friend.user.image && (
                    <img src={friend.user.image} alt={friend.user.name || ""} className="w-12 h-12 rounded-full" />
                  )}
                  <div>
                    <p className="font-medium">{friend.user.name || friend.user.email}</p>
                    <p className="text-sm text-gray-500">{friend.user.email}</p>
                  </div>
                </a>
                <button
                  onClick={() => removeFriend(friend.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}