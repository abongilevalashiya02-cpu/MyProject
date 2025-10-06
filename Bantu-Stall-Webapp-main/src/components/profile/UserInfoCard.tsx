import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type UserInfoCardProps = {
  user: {
    email?: string;
    id?: string;
    // add other user fields as needed
  };
};

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>
            {user?.email?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p className="text-center text-lg font-medium">{user?.email}</p>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
