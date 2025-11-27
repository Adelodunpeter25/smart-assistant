import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Smart Assistant</h1>
          <p className="text-muted-foreground">Tailwind v3 + shadcn/ui configured ✓</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Components</CardTitle>
            <CardDescription>Verify Tailwind and shadcn/ui are working</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="Type something..." />
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
            </div>
            <div className="p-4 bg-primary text-primary-foreground rounded-lg">
              Primary color test
            </div>
            <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
              Secondary color test
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
