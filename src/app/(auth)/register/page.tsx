'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to login after a short delay
    const timer = setTimeout(() => {
      router.push('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to Cellflip
          </CardTitle>
          <CardDescription>
            Registration coming soon! For now, you can login to explore.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              We're working on the registration flow. Currently, you can test the platform using our login system.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">Quick Login Options:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Email:</strong> Use any email + password</li>
                <li>• <strong>WhatsApp:</strong> Use any Indian mobile number</li>
                <li>• <strong>OTP:</strong> Any 6-digit code works</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-3">
              <Button className="w-full" asChild>
                <Link href="/login">
                  <Mail className="mr-2 h-4 w-4" />
                  Try Email Login
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Try WhatsApp Login
                </Link>
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Redirecting to login page in 3 seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 