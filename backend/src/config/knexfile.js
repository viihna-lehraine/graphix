// File: backend/src/config/knexfile.ts
const config = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './dev.db'
        },
        useNullAsDefault: true,
        migrations: {
            directory: './migrations'
        }
    }
};
export default config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25leGZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJrbmV4ZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1Q0FBdUM7QUFJdkMsTUFBTSxNQUFNLEdBQW1DO0lBQzdDLFdBQVcsRUFBRTtRQUNYLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLFVBQVUsRUFBRTtZQUNWLFFBQVEsRUFBRSxVQUFVO1NBQ3JCO1FBQ0QsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixVQUFVLEVBQUU7WUFDVixTQUFTLEVBQUUsY0FBYztTQUMxQjtLQUNGO0NBQ0YsQ0FBQztBQUVGLGVBQWUsTUFBTSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogYmFja2VuZC9zcmMvY29uZmlnL2tuZXhmaWxlLnRzXG5cbmltcG9ydCB7IEtuZXggfSBmcm9tICdrbmV4JztcblxuY29uc3QgY29uZmlnOiB7IFtrZXk6IHN0cmluZ106IEtuZXguQ29uZmlnIH0gPSB7XG4gIGRldmVsb3BtZW50OiB7XG4gICAgY2xpZW50OiAnc3FsaXRlMycsXG4gICAgY29ubmVjdGlvbjoge1xuICAgICAgZmlsZW5hbWU6ICcuL2Rldi5kYidcbiAgICB9LFxuICAgIHVzZU51bGxBc0RlZmF1bHQ6IHRydWUsXG4gICAgbWlncmF0aW9uczoge1xuICAgICAgZGlyZWN0b3J5OiAnLi9taWdyYXRpb25zJ1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIl19