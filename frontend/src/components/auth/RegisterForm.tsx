import { useState } from 'react';
import { Button } from './../ui/button';
import { Input } from './../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './../ui/card';
import { Label } from './../ui/label';
import { RadioGroup, RadioGroupItem } from './../ui/radio-group';
import { useAuth } from './../../contexts/AuthContext';
import type { UserRole } from './../../types';
import { toast } from 'sonner';

interface RegisterFormProps {
    onSwitchToLogin: () => void;
}

const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<UserRole>('client');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const success = await register(email, password, name, role);
            if (success) {
                toast.success('Account created successfully!');
            } else {
                toast.error('Registration failed. Please try again.');
            }
        } catch (error) {
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                <p className="text-muted-foreground">Join our support platform</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                            placeholder="Create a password"
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
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-primary hover:underline font-medium"
                    >
                        Sign in
                    </button>
                </div>
            </CardContent>
        </Card>
    );
};

export default RegisterForm;