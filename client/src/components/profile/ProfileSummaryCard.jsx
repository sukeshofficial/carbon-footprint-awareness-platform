import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { User, Home, MessageSquare, MapPin } from 'lucide-react';
import { USER_TYPES_LIST, TONE_PREFERENCES_LIST, HOUSEHOLD_TYPES_LIST } from './constants';

const ProfileSummaryCard = ({ profile }) => {
  if (!profile) return null;

  const userType = USER_TYPES_LIST.find(t => t.id === profile.userType)?.title || profile.userType;
  const tonePref = TONE_PREFERENCES_LIST.find(t => t.id === profile.tonePreference)?.title || profile.tonePreference;
  const householdType = HOUSEHOLD_TYPES_LIST.find(h => h.id === profile.householdType)?.title || profile.householdType;

  return (
    <Card className="w-full mt-10 border-none shadow-2xl shadow-primary/10 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{profile.displayName}</span>
          <Badge variant="outline">Age group: {profile.ageGroup || 'Age Unknown'}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">User Type</span>
            <span className="text-sm font-medium">{userType}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Region</span>
            <span className="text-sm font-medium">{profile.cityRegion}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Home className="w-4 h-4 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Household</span>
            <span className="text-sm font-medium">{householdType}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MessageSquare className="w-4 h-4 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Coaching Tone</span>
            <span className="text-sm font-medium">{tonePref}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSummaryCard;
