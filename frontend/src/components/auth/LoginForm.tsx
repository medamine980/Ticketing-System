import { useState } from 'react';
import { Button } from './../ui/button';
import { Input } from './../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './../ui/card';
import { Label } from './../ui/label';
import { RadioGroup, RadioGroupItem } from './../ui/radio-group';
import { useAuth } from './../../contexts/AuthContext';
import type { UserRole } from './../../types';
import { toast } from 'sonner';

interface LoginFormProps {
    onSwitchToRegister: () => void;
}

const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('client');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { success, message } = await login(email, password, role);
            if (success) {
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <p className="text-muted-foreground">Sign in to your account</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Account Type</Label>
                        <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="client" id="client" />
                                <Label htmlFor="client">Client</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="agent" id="agent" />
                                <Label htmlFor="agent">Support Agent</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-primary hover:underline font-medium"
                    >
                        Create account
                    </button>
                </div>
                <div className="mt-4 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Demo Credentials:</p>
                    <p>Client: client@demo.com</p>
                    <p>Agent: agent@demo.com</p>
                    <p>Password: any password</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default LoginForm;