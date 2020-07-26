#Definition for a binary tree node.
class TreeNode:
    def __init__(self,x):
       self.val = x
       self.left = None
       self.right = None

class Solution:
    def isValidBST(self, root: TreeNode) -> bool:
        def helper(node, lower, upper):
            if not node:
                return True

        val = node.val
        if val <= lower or val >= upper:
            return False

        if not helper(node.right, val, upper):
            return False
        if not helper(node.left,lower, val):
            return False
        return True

        return helper(root, float('-inf'), float('inf'))
